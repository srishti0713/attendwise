import React from "react";
import Button from "../../components/buttons/Button";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-900 via-blue-900 to-black flex flex-col justify-between text-white">
            {/* Top Section */}
            <div className="flex flex-col items-center justify-center flex-1 px-6 text-center">
                <div className="max-w-xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        AttendWise
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl mb-8">
                        Manage your classes, track attendance, and stay
                        organized like never before.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            label="Sign Up"
                            onClick={() => navigate("/register")}
                        />
                        <Button
                            label="Sign In"
                            outline
                            onClick={() => navigate("/login")}
                        />
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="px-6 pb-16">
                <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
                    <div className="card bg-base-100/10 backdrop-blur-lg shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Easy Tracking</h2>
                            <p className="text-gray-300">
                                Mark and manage attendance quickly with a simple
                                interface.
                            </p>
                        </div>
                    </div>

                    <div className="card bg-base-100/10 backdrop-blur-lg shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Analytics</h2>
                            <p className="text-gray-300">
                                Get insights into attendance trends and
                                performance.
                            </p>
                        </div>
                    </div>

                    <div className="card bg-base-100/10 backdrop-blur-lg shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Secure & Reliable</h2>
                            <p className="text-gray-300">
                                Your data is safe and accessible anytime,
                                anywhere.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="pb-10 text-center">
                <p className="text-gray-400 mb-4">
                    Ready to simplify your attendance?
                </p>
                <Button
                    label="Create Account"
                    variant="secondary"
                    onClick={() => navigate("/register")}
                />
            </div>
        </div>
    );
};
export default LandingPage;
