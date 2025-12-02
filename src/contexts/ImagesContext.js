import { jsx as _jsx } from "react/jsx-runtime";
import { useState, createContext, useContext } from 'react';
const ImagesContext = createContext(undefined);
// eslint-disable-next-line react-refresh/only-export-components
export function useImages() {
    const ctx = useContext(ImagesContext);
    if (!ctx)
        throw new Error('useImages must be used inside ImagesProvider');
    return ctx;
}
export function ImagesProvider({ children }) {
    const [images, setImages] = useState([]);
    const [selectIndex, setSelectIndex] = useState(0);
    const addImages = async (files) => {
        if (!files || files.length === 0)
            return;
        const readFile = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    resolve({
                        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                        file,
                        url: String(reader.result)
                    });
                };
                reader.onerror = () => reject(new Error('Failed to read file'));
                reader.readAsDataURL(file);
            });
        };
        try {
            const items = await Promise.all(files.map(f => readFile(f)));
            setImages(prev => [...prev, ...items]);
            // Set selectIndex to first newly added image if this is the first batch
            if (images.length === 0 && items.length > 0) {
                setSelectIndex(0);
            }
        }
        catch (error) {
            console.error('Error adding images:', error);
        }
    };
    const updateImage = (id, patch) => {
        setImages(prev => prev.map(img => (img.id === id ? { ...img, ...patch } : img)));
    };
    const clear = () => {
        setImages([]);
        setSelectIndex(0);
    };
    return (_jsx(ImagesContext.Provider, { value: {
            images,
            addImages,
            setImages,
            selectIndex,
            setSelectIndex,
            updateImage,
            clear
        }, children: children }));
}
