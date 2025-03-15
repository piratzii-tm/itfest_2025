import * as FileSystem from "expo-file-system";
import axios from "axios";
import { environment } from "../constants";
import { useContext, useState } from "react";
import { RootContext } from "../store";
import { Alert } from "react-native";

export const useCamera = () => {
  const [photo, setPhoto] = useState("");
  const [error, setError] = useState("");
  const { isProcessing, setProcessing } = useContext(RootContext);

  const [cameraRef, setCameraRef] = useState(null);

  const takePhoto = async () => {
    if (!cameraRef) {
      console.log("Camera not ready");
      return;
    }
    const photoData = await cameraRef.takePictureAsync();
    setPhoto(photoData.uri);
    console.log("Photo captured:", photoData.uri);
  };

  const processImageContents = async () => {
    if (!photo) {
      setError("No photo captured! Take a photo first.");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const imageBase64 = await FileSystem.readAsStringAsync(photo, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4-turbo",
          messages: [
            {
              role: "system",
              content:
                "Extract structured data from a receipt image. Only return a valid JSON object—no additional text, comments, or explanations. Don't add: ✅ Extracted Data",
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `If the image is unclear or you can't understand, return error.Extract receipt details and return a valid JSON object in the following format:
                \`\`\`json
                {
                  "store": "",
                  "date": "",
                  "items": [
                    {
                      "name": "",
                      "quantity": 1,
                      "price": 0.00
                    }
                  ],
                  "total": 0.00
                }
                \`\`\`
                **Return only the JSON output with no extra text. Your response should be in JSON format. Don't add: ✅ Extracted Data**`,
                },
                {
                  type: "image_url",
                  image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
                },
              ],
            },
          ],
          response_format: { type: "json_object" },
          max_tokens: 500,
        },
        {
          headers: {
            Authorization: `Bearer ${environment.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        },
      );

      const extractedText = response.data.choices[0].message.content.trim();

      const jsonMatch = extractedText.match(/\{[\s\S]*\}/);

      if (!jsonMatch) throw new Error("Invalid JSON response from AI.");

      const receiptData = JSON.parse(jsonMatch[0]);

      setProcessing(false);

      console.log(receiptData);

      if (receiptData.error) {
        Alert.alert(receiptData.error);
        return;
      }

      return receiptData;
    } catch (error) {
      Alert.alert(error.response?.data || error.message);
      console.error(
        "❌ OpenAI API Error:",
        error.response?.data || error.message,
      );
      setError("Failed to process the receipt. Try again.");
    } finally {
      setProcessing(false);
    }
  };

  return {
    photo,
    cameraRef,
    setCameraRef,
    isProcessing,
    error,
    takePhoto,
    processImageContents,
  };
};
