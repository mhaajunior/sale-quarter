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
  right = false,
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
  right?: boolean;
  onIconClick?: () => void;
  errors: any;
  [rest: string]: any;
}) => {
  const classes = classNames(rest.className, "flex flex-col", {
    error: errors,
  });

  return (
    <div className={classes}>
      <div className="relative">
        {!textarea && (
          <div className="flex">
            <input
              type={rest.type}
              className={`input w-full ${right ? "text-right" : ""} ${
                showWord ? "!rounded-r-none" : ""
              }`}
              placeholder={`${placeholder}`}
              autoComplete="off"
              align="right"
              disabled={disabled}
              {...rest.register(name, {
                valueAsNumber: isNumber,
                shouldUnregister: true,
              })}
            />
            {showWord && (
              <div className="flex justify-center items-center px-3 border bg-slate-200 rounded-r-[10px] border-l-0">
                {showWord}
              </div>
            )}
            {showName && (
              <div className="absolute text-[9px] text-gray-400  top-[-8px] left-2 bg-white p-[2px]">
                {placeholder}
              </div>
            )}
            {icon && (
              <div
                className={`absolute flex items-center right-3 h-full text-gray-400 ${
                  disabled
                    ? "cursor-not-allowed"
                    : "cursor-pointer hover:text-black"
                }`}
                onClick={onIconClick}
              >
                {icon}
              </div>
            )}
          </div>
        )}
        {textarea && (
          <textarea
            className="input w-full"
            placeholder={`${placeholder}`}
            rows="4"
            {...rest.register(name, { valueAsNumber: isNumber })}
          />
        )}
      </div>
      <ErrorMessage>{errors?.message}</ErrorMessage>
    </div>
  );
};

export default Input;
