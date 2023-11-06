import React, { useEffect, useState } from "react";
import { addChecked, removeChecked } from "../features/deleteImageSlice";
import { useDispatch } from "react-redux";

const Image = ({
  image,
  id,
  index,
  currentHover,
  isDragging,
  setDragging,
  dragIndex,
  setmouseLoc,
  setmouseNewLoc,
  imgDrag,
  imgDragOver,
  setCurrentHover,
  imgArr,
  setImgArr,
  mouseLoc,
  mouseNewLoc,
}) => {
  const [checked, setChecked] = useState(null);

  const handleChecked = (e) => {
    //Updating the state of checkbox variable(checked) when checkbox is selected of an image
    setChecked(e.target.checked);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    //updating redux state( adding id and check state when selected and removing when unselecting it)
    if (checked === true) {
      dispatch(addChecked({ checked, id }));
    } else if (checked === false) {
      dispatch(removeChecked({ checked, id }));
    }
  }, [dispatch, checked, id]);
  return (
    <div
      key={image.id}
      className={`${
        index === 0 ? "col-span-2 row-span-2" : ""
      } hover:brightness-50 ${
        checked ? "border-2 border-blue-500 rounded-3xl" : ""
      }`}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={checked || false}
          onChange={handleChecked}
          className={`absolute top-4 left-4 ${
            (currentHover === index || checked === true) && !isDragging
              ? ""
              : "hidden"
          }`}
        />
      </div>
      <img
        onMouseDown={(e) => {
          //After clicking it will set initial axis and dragging state
          setDragging(true);
          dragIndex.current = index;
          setmouseLoc([e.screenX, e.screenY]);
          setmouseNewLoc([e.screenX, e.screenY]);
          imgDrag.current = index;
        }}
        onMouseMove={(e) => {
          //changing axis when moving the image
          isDragging && setmouseNewLoc([e.screenX, e.screenY]);
        }}
        onMouseEnter={(e) => {
          //reordering image after droppping it
          imgDragOver.current = index;
          if (index >= 0) setCurrentHover(index);

          if (imgDrag.current != null && imgDragOver.current != null) {
            const temp1 = imgArr.splice(imgDrag.current, 1);
            const temp2 = imgArr.splice(imgDragOver.current);

            setImgArr([...imgArr, ...temp1, ...temp2]);

            imgDrag.current = null;
            imgDragOver.current = null;
          }
        }}
        onMouseUp={(e) => {
          //setting dragging state to false and resetting axis after reordering is done
          setmouseLoc([0, 0]);
          setmouseNewLoc([0, 0]);
          setDragging(false);
        }}
        style={
          isDragging && dragIndex.current === index
            ? {
                translate: `${mouseNewLoc[0] - mouseLoc[0]}px ${
                  mouseNewLoc[1] - mouseLoc[1]
                }px`,
              }
            : {}
        }
        draggable={false}
        className={`h-full w-full border-2 rounded-3xl object-cover border-slate-300  ${
          index === 0 ? "col-span-2 row-span-2" : ""
        } cursor-pointer `}
        id={Image.id}
        key={image.id}
        src={image.image}
        alt=""
      />
    </div>
  );
};

export default Image;
