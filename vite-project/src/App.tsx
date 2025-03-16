import React, { useState } from 'react';

// interface PredictionRequest {
//     age: number;
//     height: number;
// }

interface PredictionResponse {
    weight: number;
}

function WeightPrediction() {
    const [age, setAge] = useState<string>('');
    const [height, setHeight] = useState<string>('');
    const [weight, setWeight] = useState<string>(''); // String to display
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const predictWeight = async (): Promise<void> => {
        setError('');
        setWeight('');

        if (!age || !height) {
            setError("Please enter both age and height.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`https://infer-app.onrender.com/predict?age=${age}&height=${height}`);
            if (response.ok) {
                const data: PredictionResponse = await response.json();
                setWeight(`Predicted Weight: ${data.weight.toFixed(2)} kg`);
            } else {
                setError(`Error: ${response.statusText}`);
            }
        } catch (e:any) {
            setError(`An error occurred: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAge(e.target.value);
    }

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHeight(e.target.value);
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white">
            <div className="container p-3 w-80 text-center">
                <div className="inputs flex m-2">
                    <input
                        type="number"
                        id="age"
                        placeholder="Age"
                        min="1"
                        value={age}
                        onChange={handleAgeChange}
                        className="bg-blue-50 w-full p-1 m-1 rounded-md border-none"
                    />
                    <input
                        type="number"
                        id="height"
                        placeholder="Height (cm)"
                        min="1"
                        value={height}
                        onChange={handleHeightChange}
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