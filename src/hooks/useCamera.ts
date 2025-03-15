import * as FileSystem from "expo-file-system";
import axios from "axios";
import {environment} from "../constants";
import {useContext, useState} from "react";
import {RootContext} from "../store";

export const useCamera = () => {
    const [photo, setPhoto] = useState("");
    const [error, setError] = useState("");
    const {isProcessing, setProcessing} = useContext(RootContext);


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
                            content: "Extract structured data from a receipt image.",
                        },
                        {
                            role: "user",
                            content: [
                                {
                                    type: "text",
                                    text: "Extract receipt details and return as JSON: { store: '', date: '', items: [{ name: '', quantity: 1, price: 0.00 }], total: 0.00 }"
                                },
                                {type: "image_url", image_url: {url: `data:image/jpeg;base64,${imageBase64}`}}
                            ],
                        },
                    ],
                    max_tokens: 500,
                },
                {
                    headers: {
                        "Authorization": `Bearer ${environment.OPENAI_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("✅ Extracted Data:", response.data.choices[0].message.content);
        } catch (error) {
            console.error("❌ OpenAI API Error:", error.response?.data || error.message);
            setError("Failed to process the receipt. Try again.");
        } finally {
            setProcessing(false);
        }
    };

    return {photo, cameraRef, setCameraRef, isProcessing, error, takePhoto, processImageContents};
}