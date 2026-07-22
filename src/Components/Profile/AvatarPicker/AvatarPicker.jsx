import { useRef, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import styles from './AvatarPicker.module.css';

const ICON_COLORS = ['#0F3D3E', '#C9924A', '#A13D2E', '#2E5C8A', '#6A3D7A', '#2E7D4F'];

function getInitial(name) {
  return name?.trim().charAt(0).toUpperCase() || '?';
}

/**
 * AvatarPicker
 * `avatar` shape: { type: 'photo', url } or { type: 'icon', color }.
 * If the user never uploads a photo, they still get a clean colored
 * initial avatar instead of a broken image or empty circle.
 */
function AvatarPicker({ avatar, name, onChange }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelected = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Convert the chosen photo to a data URL so it can be stored and
    // displayed without needing a real file upload endpoint yet.
    // TODO: once the backend exists, upload the file (e.g. to
    // POST /api/users/me/avatar) and store the returned URL instead.
    const reader = new FileReader();
    reader.onload = () => {
      onChange({ type: 'photo', url: reader.result });
      setIsMenuOpen(false);
    };
    reader.readAsDataURL(file);
  };

  const handlePickColor = (color) => {
    onChange({ type: 'icon', color });
    setIsMenuOpen(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.avatarCircle}>
        {avatar?.type === 'photo' ? (
          <img src={avatar.url} alt={name} className={styles.avatarImage} />
        ) : (
          <span
            className={styles.avatarInitial}
            style={{ backgroundColor: avatar?.color || ICON_COLORS[0] }}
          >
            {getInitial(name)}
          </span>
        )}

        <button
          type="button"
          className={styles.editButton}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Change avatar"
        >
          <EditIcon fontSize="small" />
        </button>
      </div>

      {isMenuOpen && (
        <div className={styles.menu}>
          <button
            type="button"
            className={styles.uploadButton}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Photo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className={styles.hiddenInput}
            onChange={handleFileSelected}
          />

          <span className={styles.menuLabel}>Or pick a color</span>
          <div className={styles.colorRow}>
            {ICON_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={styles.colorSwatch}
                style={{ backgroundColor: color }}
                onClick={() => handlePickColor(color)}
                aria-label={`Use ${color} avatar`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AvatarPicker;