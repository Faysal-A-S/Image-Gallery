import React, { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import "./App.css";
import { BsFillImageFill } from "react-icons/bs";
import Image from "./Components/Image";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { removeCheckedAll } from "./features/deleteImageSlice";

const images = require.context("../src/assets/Images", true);
const imageList = images.keys().map((image) => images(image));
function App() {
  const { checked } = useSelector((state) => state.checked);
  const [isChecked, setIsChecked] = useState(false);
  const [currentHover, setCurrentHover] = useState();
  const dispatch = useDispatch();
  const [curImage, setCurImage] = useState(null);
  const [updatedImg, setUpdatedImg] = useState();
  const inputBtnRef = useRef();

  const handleOnchange = (e) => {
    //updating the curimage variable after we select an image
    let file = e.target.files[0];
    if (file && file.type.substr(0, 5) === "image") {
      setCurImage(file);
    } else {
      setCurImage(null);
    }
  };

  const imgList = imageList.map((image) => {
    return {
      image: image,
      id: uuid(),
      draggable: false,
    };
  });
  const [imgArr, setImgArr] = useState(imgList);

  useEffect(() => {
    //Setting the file selected checkbox to checked if any item is selected
    if (checked.length > 0) {
      setIsChecked(true);
    }
  }, [checked, isChecked]);
  useEffect(() => {
    //Adding the image in updatedImg variable
    if (curImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedImg(reader.result);
      };
      reader.readAsDataURL(curImage);
    } else {
      setUpdatedImg(null);
    }
  }, [curImage]);
  useEffect(() => {
    //Adding updatedimg variable image to main array
    if (updatedImg) {
      let newArr = [
        ...imgArr,
        { image: updatedImg, id: uuid(), draggable: false },
      ];
      setImgArr(newArr);
      setUpdatedImg(null);
    }
  }, [setImgArr, updatedImg, imgArr]);
  let imgDrag = useRef();
  let imgDragOver = useRef();

  const [isDragging, setDragging] = useState(false);
  const dragIndex = useRef(null);
  const [mouseLoc, setmouseLoc] = useState([0, 0]);
  const [mouseNewLoc, setmouseNewLoc] = useState([0, 0]);

  const handleDelete = () => {
    //Deleting selected images (removing them from array and clearing redux state)
    dispatch(removeCheckedAll());
    let newArr = [...imgArr];
    for (let i = 0; i < checked.length; i++) {
      newArr = newArr.filter((item) => item.id !== checked[i].id);
    }
    setImgArr(newArr);
  };
  return (
    <div className="w-full h-full items-center flex justify-center">
      <div className="flex  w-5/6 h-5/6 m-14 flex-wrap bg-white rounded-3xl overflow-hidden justify-center">
        {checked.length > 0 ? (
          <div className="border-b-2 w-full p-5 flex justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
              />
              <h1 className="font-bold text-xl">
                &nbsp; {checked.length} {checked.length > 1 ? "Files" : "File"}{" "}
                Selected
              </h1>
            </div>
            <button
              className="font-bold text-xl text-red-600"
              onClick={() => handleDelete()}
            >
              Delete {checked.length > 1 ? "Files" : "File"}
            </button>
          </div>
        ) : (
          <div className="border-b-2 w-full p-5">
            <h1 className="font-bold text-xl">Gallery</h1>
          </div>
        )}

        <div className="basis-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 bg-white mt-5 p-10  relative">
          {imgArr.map((image, index) => (
            <Image
              key={image.id}
              index={index}
              image={image}
              id={image.id}
              currentHover={currentHover}
              isDragging={isDragging}
              setDragging={setDragging}
              dragIndex={dragIndex}
              setmouseLoc={setmouseLoc}
              setmouseNewLoc={setmouseNewLoc}
              imgDrag={imgDrag}
              imgDragOver={imgDragOver}
              setCurrentHover={setCurrentHover}
              imgArr={imgArr}
              setImgArr={setImgArr}
              mouseLoc={mouseLoc}
              mouseNewLoc={mouseNewLoc}
            />
          ))}
          <div
            className="col-span-1 row-span-1 flex flex-col justify-center items-center h-full w-full border-2 border-dashed rounded-3xl p-3 border-slate-300 bg-slate-50 cursor-pointer"
            onClick={() => {
              inputBtnRef.current.click();
            }}
          >
            <input
              ref={inputBtnRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleOnchange(e)}
            />

            <BsFillImageFill size={25} className="text-slate-300" />

            <h1 className="mt-3 font-bold text-xs md:text:xl lg:text-2xl">
              Add Images
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
