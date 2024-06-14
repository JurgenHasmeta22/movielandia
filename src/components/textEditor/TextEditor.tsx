// import React, { forwardRef, useEffect } from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { Typography } from "@mui/material";
// import Rating from "@mui/material/Rating";
// import Box from "@mui/material/Box";

// interface ITextEditorProps {
//     value: string;
//     ref: any;
//     rating: number | null;
//     setRating: React.Dispatch<React.SetStateAction<number | null>>;
//     onChange: (value: string) => void;
// }

// const modules = {
//     toolbar: [
//         [{ header: "1" }, { header: "2" }, { font: [] }],
//         [{ size: [] }],
//         ["bold", "italic", "underline", "strike", "blockquote"],
//         [{ list: "ordered" }, { list: "bullet" }],
//         ["link", "image", "video"],
//         ["clean"],
//     ],
// };

// const formats = [
//     "header",
//     "font",
//     "size",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "blockquote",
//     "list",
//     "bullet",
//     "link",
//     "image",
//     "video",
// ];

// const TextEditor: React.FC<ITextEditorProps> = forwardRef(({ value, onChange, rating, setRating }, ref) => {
//     useEffect(() => {
//         const resizeImages = () => {
//             const quillEditor = ref?.current?.getEditor?.();

//             if (quillEditor) {
//                 const images = quillEditor.container.querySelectorAll("img");
//                 images.forEach((img: HTMLImageElement) => {
//                     img.style.maxWidth = "50%";
//                     img.style.maxHeight = "auto";
//                 });
//             }
//         };

//         const editorInstance = ref?.current?.getEditor?.();

//         if (editorInstance) {
//             resizeImages();
//             editorInstance.on("text-change", resizeImages);
//         }

//         return () => {
//             if (editorInstance) {
//                 editorInstance.off("text-change", resizeImages);
//             }
//         };
//     }, [ref, value]);

//     return (
//         <Box>
//             <ReactQuill
//                 theme="snow"
//                 value={value}
//                 onChange={onChange}
//                 modules={modules}
//                 formats={formats}
//                 ref={ref}
//                 style={{
//                     marginBottom: "10px",
//                 }}
//             />
//             <Box
//                 sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "flex-start",
//                 }}
//             >
//                 <Typography variant="body2" fontSize={14} fontWeight={700} sx={{ mr: 1 }}>
//                     {rating?.toFixed(1)}
//                 </Typography>
//                 <Rating
//                     name="review-rating"
//                     value={rating}
//                     onChange={(event, newValue) => {
//                         setRating(newValue);
//                     }}
//                     max={10}
//                     precision={0.5}
//                 />
//             </Box>
//         </Box>
//     );
// });

// export default TextEditor.displayName = "TextEditor";
