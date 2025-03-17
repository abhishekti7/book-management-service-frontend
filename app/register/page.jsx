'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import MandatoryAsterisk from "@/components/MandatoryAsterisk";

import { useAuth } from "@/contexts/auth-context";

import "./styles.scss";

const Register = props => {
    const router = useRouter();
    const { register, isAuthenticated } = useAuth();

    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
    });

    const [error, setError] = useState({
        email: null,
        password: null,
        firstName: null,
    });

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    const validate = () => {
        let hasError = false;
        const errorObj = {};

        if (!formData.email) {
            hasError = true;
            errorObj.email = 'Please enter email';
        }

        if (!formData.password) {
            hasError = true;
            errorObj.password = 'Please enter password';
        }

        if (!formData.firstName) {
            hasError = true;
            errorObj.firstName = 'Please enter first name';
        }

        if (hasError) {
            setError(errorObj);
            return false;
        }

        setError({});
        return true;
    };

    const onSubmit = async () => {
        setIsLoading(true);
        setError({});

        try {
            const response = await register({
                email: formData.email,
                password: formData.password,
                first_name: formData.firstName,
                last_name: formData.lastName,
                userType: 2,
            });
            console.log(response)
        } catch (error) {
            console.log(error);
        }

        setIsLoading(false);
    };


    const handleOnRegister = () => {
        if (validate()) {
            onSubmit();
        }
    };

    return (
        <div className="register__container">
            <div className="register__container--form">
                <div className="form-header">
                    <div className="header-title">Create a new account</div>
                </div>
                <FormInput
                    classes="form-input forminput-email"
                    placeholder="Enter email address"
                    label={<>Email Address <MandatoryAsterisk /></>}
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
                    label={<>Password <MandatoryAsterisk /></>}
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

                <FormInput
                    classes="form-input forminput-firstname"
                    placeholder="Enter First name"
                    label={<>First Name <MandatoryAsterisk /></>}
                    inputType="text"
                    value={formData.firstName}
                    error={error.firstName}
                    onChange={(name) => {
                        setFormData(prevObj => {
                            return {
                                ...prevObj,
                                firstName: name,
                            }
                        })
                    }}
                />

                <FormInput
                    classes="form-input forminput-lastname"
                    placeholder="Enter Last Name"
                    label="Last Name"
                    inputType="text"
                    value={formData.lastName}
                    onChange={(name) => {
                        setFormData(prevObj => {
                            return {
                                ...prevObj,
                                lastName: name,
                            }
                        })
                    }}
                />

                <div className="form-actions">
                    <Button
                        classes="form-actions-register"
                        label="Register"
                        isLoading={isLoading}
                        onClick={handleOnRegister} />

                    <div className="form-actions-login">
                        Already have an account? <Link href="/login">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;