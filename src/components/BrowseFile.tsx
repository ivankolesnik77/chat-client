import {
  useState,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
  FC,
} from "react";
import { ICONS } from "../utils/constants";

type PropsType = {
  setFile: Dispatch<SetStateAction<File | null>>;
  file: File | null;
};

export const BrowseFile: FC<PropsType> = ({ setFile, file }) => {
  const inputFile = useRef<HTMLInputElement>(null);

  const [dragging, setDragging] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  let dragCounter = 0;

  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (upload: File) => {
    setFile(upload);
  };

  const onClearFile = () => {
    if (inputFile.current) {
      inputFile.current.value = "";
    }
    setFile(null);
  };

  const handleDragIn = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragging(true);
      dragCounter++;
    }
  };

  const handleDragOut = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter--;
    if (dragCounter === 0) {
      setDragging(false);
    }
  };

  const handleDropEvent = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleDrop(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
      dragCounter = 0;
    }
  };

  useEffect(() => {
    const div = dropRef.current;

    if (div) {
      div.addEventListener("dragenter", handleDragIn);
      div.addEventListener("dragleave", handleDragOut);
      div.addEventListener("dragover", handleDrag);
      div.addEventListener("drop", handleDropEvent);
    }

    return () => {
      if (div) {
        div.removeEventListener("dragenter", handleDragIn);
        div.removeEventListener("dragleave", handleDragOut);
        div.removeEventListener("dragover", handleDrag);
        div.removeEventListener("drop", handleDropEvent);
      }
    };
  }, []);

  return (
    <div className="mb-4 top-[50px] absolute w-full h-full">
      <div
        ref={dropRef}
        className=" rounded-lg p-8 mx-auto flex flex-col items-center w-full h-full mb-3 absolute"
      >
        {dragging && (
          <div className="border-dashed border-2 border-gray-400 bg-white bg-opacity-80 absolute inset-0 z-50 flex items-center justify-center">
            <div className="text-gray-500 text-2xl">Drop here</div>
          </div>
        )}
      </div>

      {!!file?.name && (
        <div className="flex items-center bg-gray-100 px-4 w-min py-2 rounded-md shadow-md">
          <img
            src={ICONS.ATTACHED_FILE}
            alt="Attached file"
            className="w-4 h-4 mr-2"
          />

          <p className="flex-1 text-black font-semibold px-1">{file?.name}</p>

          <button
            type="reset"
            onClick={onClearFile}
            className="mr-2 py-1 px-2.5 cursor-pointer text-black "
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default BrowseFile;
