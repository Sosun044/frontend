import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

function PhotoViewer({ personelId, size = "small", className = "" }) {
    const [photoSrc, setPhotoSrc] = useState(null);

    useEffect(() => {
        const fetchPhoto = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await axios.get(`http://localhost:8080/rest/api/personal/${personelId}/photo`, {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: "blob"
                });
                const imageUrl = URL.createObjectURL(response.data);
                setPhotoSrc(imageUrl);
            } catch (e) {
                if (e.response?.status === 404) {
                    console.warn("Kişiye ait fotoğraf bulunamadı.");
                }
                setPhotoSrc("/images/default-user.png");
            }
        };

        fetchPhoto();
    }, [personelId]);

    const sizeClass =
        size === "large" ? "w-40 h-52" :
            size === "medium" ? "w-24 h-32" :
                "w-12 h-12";

    return (
        <img
            src={photoSrc}
            alt="Profil Fotoğrafı"
            className={`object-cover rounded-lg border ${sizeClass} ${className}`}
        />
    );
}

PhotoViewer.propTypes = {
    personelId: PropTypes.number.isRequired,
    size: PropTypes.oneOf(["small", "medium", "large"]),
    className: PropTypes.string
};

export default PhotoViewer;
