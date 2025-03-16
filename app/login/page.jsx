'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/contexts/auth-context";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

import "./styles.scss"

const Login = (props) => {
    const router = useRouter();
    const { login, isAuthenticated } = useAuth();

    const [isLoading, setIsLoading] = useState(false);

    // check if user is already logged in
    // if yes, then redirect to the homepage
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState({
        email: null,
        password: null,
    });

    // validate form inputs, check if email and password have been entered
    const validate = () => {
        let hasError = false;
        const errorObj = {};

        if (!formData.email) {
            errorObj.email = 'Please enter email';
            hasError = true;
        }

        if (!formData.password) {
            errorObj.password = 'Please enter password';
            hasError = true;
        }

        if (hasError) {
            setError(errorObj);
            return false;
        }

        setError({});
        return true;
    }

    const onSubmit = async () => {
        setIsLoading(true);
        setError({});

        try {
            const response = await login(formData.email, formData.password);
            console.log(response)
        } catch (error) {
            console.log(error);
        }

        setIsLoading(false);
    };

    const handleOnLogin = () => {
        if (validate()) {
            onSubmit();
        }
    };

    return (
        <div className="login__container">
            <div className="login__container--form">
                <div className="form-header">
                    <div className="header-title">Login to your account</div>
                    <div className="header-subtitle">Enter your credentials to access your account</div>
                </div>
                <FormInput
                    classes="form-input forminput-email"
                    placeholder="Enter email address"
                    label="Email Address"
                    inputType="email"
                    value={formData.email}
                    error={error.email}
                    onChange={(email) => {
                        setFormData(prevObj => {
                            return {
                                ...prevObj,
                                email: email,
                            }
                        })
                    }}
                />

                <FormInput
                    classes="form-input forminput-password"
                    placeholder="Enter Password"
                    label="Password"
                    inputType="password"
                    value={formData.password}
                    error={error.password}
                    onChange={(password) => {
                        setFormData(prevObj => {
                            return {
                                ...prevObj,
                                password: password,
                            }
                        })
                    }}
                />

                <div className="form-actions">
                    <Button classes="form-actions-login" label="Login" onClick={handleOnLogin} />

                    <div className="form-actions-register">
                        Need a new account? <Link href="/register">Register</Link>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Login;