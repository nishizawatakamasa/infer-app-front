import React, { useState } from 'react';
import axios from 'axios';

interface PredictionResponse {
    weight: number;
}

const WeightPrediction = () => {
    const [age, setAge] = useState<number | null>(null);
    const [height, setHeight] = useState<number | null>(null);
    const [weight, setWeight] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const parsedValue = value === '' ? null : Number(value);
        switch (name) {
            case "age":
                setAge(parsedValue);
                break;
            case "height":
                setHeight(parsedValue);
                break;
        }
    };

    const predictWeight = async (): Promise<void> => {
        setError('');
        setWeight('');

        if (age === null || height === null) {
            setError("Please enter both age and height.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get<PredictionResponse>(`https://infer-app.onrender.com/predict`, {
                params: {
                    age: age,
                    height: height
                }
            });

            setWeight(`Predicted Weight: ${response.data.weight.toFixed(2)} kg`);

        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    setError(`${error.response.status} ${error.response.data.detail}`);
                } else {
                    setError('Error: Network Error');
                }
            } else {
                setError(`An unexpected error occurred: ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white">
            <div className="container p-3 w-80 text-center">
                <div className="inputs flex m-2">
                    <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        min="1"
                        value={age === null ? '' : age.toString()}
                        onChange={handleInputChange}
                        className="bg-blue-50 w-full p-1 m-1 rounded-md border-none"
                    />
                    <input
                        type="number"
                        name="height"
                        placeholder="Height (cm)"
                        min="1"
                        value={height === null ? '' : height.toString()}
                        onChange={handleInputChange}
                        className="bg-blue-50 w-full p-1 m-1 rounded-md border-none"
                    />
                </div>
                <div id="predictionResult" className="m-4 p-1 text-lg text-gray-700 h-15 flex items-center justify-center">
                    {error ? (
                        <p className="text-red-500">{error}</p>
                    ) : weight ? (
                        <p>{weight}</p>
                    ) : (
                        "Enter age and height to see prediction."
                    )}
                </div>
                <button
                    onClick={predictWeight}
                    disabled={isLoading}
                    className="bg-indigo-500 hover:bg-indigo-400 text-white py-2 px-4 m-2 rounded-md cursor-pointer transition-colors shadow-md"
                >
                    {isLoading ? "Predicting..." : "Predict Weight"}
                </button>
            </div>
        </div>
    );
}

export default WeightPrediction;
