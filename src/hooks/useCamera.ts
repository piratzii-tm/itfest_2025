import * as FileSystem from "expo-file-system";
import axios from "axios";
import { auth, database, environment, storage } from "../constants";
import { useContext, useEffect, useState } from "react";
import { AuthContext, RootContext } from "../store";
import { Alert } from "react-native";
import { Item } from "../constants/types";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onValue, ref as dbRef, set } from "firebase/database";
import { CameraView } from "expo-camera";

export const useCamera = () => {
  const [photo, setPhoto] = useState<string>("");
  const [recipetPhoto, setRecipetPhoto] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { processing, setProcessing } = useContext(RootContext);
  const { uid } = useContext(AuthContext);

  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);

  useEffect(() => {
    fetchUserPhoto();
  }, [uid, photo]);

  const fetchUserPhoto = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const userPhotoRef = dbRef(database, `users/${userId}/photoURL`);

    const unsubscribe = onValue(userPhotoRef, (snapshot) => {
      if (snapshot.exists()) {
        setPhoto(snapshot.val());
      }
    });

    return () => unsubscribe();
  };

  const takePhoto = async () => {
    if (!cameraRef) {
      console.log("Camera not ready");
      return;
    }

    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert("Error", "User not authenticated!");
      return;
    }

    const photoData = await cameraRef.takePictureAsync();
    if (!photoData) {
      Alert.alert("Error", "Failed to capture photo.");
      return;
    }
    setPhoto(photoData.uri);
    console.log("Photo captured:", photoData.uri);

    const filename = `photos/${Date.now()}.jpg`;
    const storageRef = ref(storage, filename);

    try {
      const response = await fetch(photoData.uri);
      const blob = await response.blob();

      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);

      const userPhotoRef = dbRef(database, `users/${userId}/photoURL`);

      await set(userPhotoRef, downloadURL);
    } catch (error) {
      console.error("Photo upload error:", error);
      Alert.alert("Error", "Failed to upload photo.");
    }
  };

  const takeRecipetPhoto = async () => {
    if (!cameraRef) {
      return;
    }

    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert("Error", "User not authenticated!");
      return;
    }

    const photoData = await cameraRef.takePictureAsync();
    if (!photoData) {
      Alert.alert("Error", "Failed to capture photo.");
      return;
    }
    setRecipetPhoto(photoData.uri);
  };

  const processImageContents = async () => {
    if (!photo) {
      setError("No photo captured! Take a photo first.");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const imageBase64 = await FileSystem.readAsStringAsync(recipetPhoto, {
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

      const updatedItems = receiptData.items.map(
        (item: Item, index: number) => ({
          ...item,
          id: index,
        }),
      );

      console.log("Updated Items:", updatedItems);
      return {
        ...receiptData,
        items: updatedItems,
      };
    } catch (error: any) {
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
    setPhoto,
    cameraRef,
    setCameraRef,
    processing,
    error,
    takePhoto,
    processImageContents,
    takeRecipetPhoto,
    recipetPhoto,
  };
};
