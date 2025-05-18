import React from "react";
import { FieldError } from "react-hook-form";
import "./formInput.scss";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: FieldError;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  error,
  ...rest
}) => {
  return (
    <div className="input-group">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} {...rest} />
      {error && <p className="input-error">{error.message}</p>}
    </div>
  );
};

export default FormInput;
