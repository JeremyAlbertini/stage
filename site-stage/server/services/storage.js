const fs = require('fs');
const path = require('path');

class ImageStorage {
    constructor(type = 'local') {
        this.type = type;

        if (type === 'local') {
            this.uploadDir = path.join(__dirname, '../../public/uploads/profiles');

            if (!fs.existsSync(this.uploadDir)) {
                fs.mkdirSync(this.uploadDir, { recursive: true});
                console.log("Dossier de stockage créé:", this.uploadDir);
            }
        }
    }

    async saveProfileImage(userId, file) {
        if (this.type === 'local') {
            try {
                const filename = `profile_${userId}_${Date.now()}${path.extname(file.originalname)}`;
                const filepath = path.join(this.uploadDir, filename);

                await fs.promises.copyFile(file.path, filepath);
                await fs.promises.unlink(file.path);
                console.log(`Image de profil enregistrée pour l'user ${userId}: ${filename}`);
                return filename;
            } catch (error) {
                console.error("Erreur lors de l'enregistrement de l'image:", error);
                throw error;
            }
        }
        throw new Error("Type de stockage non supporté");
    }

    getImageUrl(filename) {
        if (!filename) return null;

        if (this.type === 'local') {
            return `/uploads/profiles/${filename}`;
        }
        throw new Error("Type de stockage non supporté");
    }

    async deleteProfileImage(filename) {
        if (!filename) return;

        if (this.type === 'local') {
            try {
                const filepath = path.join(this.uploadDir, filename);

                if (fs.existsSync(filepath)) {
                    await fs.promises.unlink(filepath);
                    console.log(`Image de profil supprimée: ${filename}`);
                }
            } catch (error) {
                console.error("Erreur lors de la suppression de l'image:", error);
            }
        }
    }
}

module.exports = new ImageStorage(process.env.STORAGE_TYPE || 'local');
