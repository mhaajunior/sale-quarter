import "@/styles/Input.css";
import { ReactNode } from "react";
import ErrorMessage from "./ErrorMessage";
import classNames from "classnames";

const Input = ({
  placeholder,
  name,
  textarea = false,
  isNumber = false,
  disabled = false,
  showName = false,
  showWord = "",
  icon,
  onIconClick,
  errors,
  ...rest
}: {
  placeholder: string;
  name: string;
  textarea?: boolean;
  isNumber?: boolean;
  disabled?: boolean;
  showName?: boolean;
  showWord?: string;
  icon?: ReactNode;
  onIconClick?: () => void;
  errors: any;
  [rest: string]: any;
}) => {
  const classes = classNames(rest.className, "relative", {
    error: errors,
  });

  return (
    <div className={classes}>
      {!textarea && (
        <>
          <input
            type={rest.type}
            className="input w-full"
            placeholder={`${placeholder}`}
            autoComplete="off"
            disabled={disabled}
            {...rest.register(name, {
              valueAsNumber: isNumber,
              shouldUnregister: true,
            })}
          />
          {showWord && (
            <div
              className={`absolute top-0 right-0 h-[40px] flex justify-center items-center px-3 border bg-slate-200 rounded-r-[10px] ${
                errors ? "border-red-500" : "border-gray-300"
              }`}
            >
              {showWord}
            </div>
          )}
          {showName && (
            <div className="absolute text-[9px] text-gray-400  top-[-8px] left-2 z-10 bg-white p-[2px]">
              {placeholder}
            </div>
          )}
        </>
      )}
      {textarea && (
        <textarea
          className="input w-full"
          placeholder={`${placeholder}`}
          rows="4"
          {...rest.register(name, { valueAsNumber: isNumber })}
        />
      )}
      {icon && (
        <div
          className="absolute top-4 right-4 text-gray-400 cursor-pointer hover:text-black"
          onClick={onIconClick}
        >
          {icon}
        </div>
      )}
      <ErrorMessage>{errors?.message}</ErrorMessage>
    </div>
  );
};

export default Input;
