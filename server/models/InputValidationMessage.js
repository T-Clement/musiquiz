const Room = require("./Room");

class InputValidationMessage {

    // register new User
    static MISSING_PSEUDO = "Le champ pseudo est requis";
    static PSEUDO_TO_SHORT = "Le pseudo doit faire plus de 3 caractères";
    static MISSING_EMAIL = "Le champ email est requis";
    static NOT_VALID_EMAIL = "L'email n'est pas valide";
    static MISSING_PASSWORD = "Le champ password est requis";
    static PASSWORD_TO_SHORT = "Le mot de passe doit faire plus de 8 caractères";
    
    // register a new room
    static MISSING_TITLE = "Le titre de la room est requis";
    static MISSING_PLAYLIST_ID = "L'identifiant de playlist est requis";
    static MISSING_THEME = "Le choix d'un thème est obligatoire";
    static TITLE_LENGTH_ERROR = `Le titre doit faire entre ${Room.ROOM_TITLE_MIN_LENGTH} et ${Room.ROOM_TITLE_MAX_LENGTH}`;
    static DESCRIPTION_LENGTH_ERROR = `La description n'est pas obligatoire, mais doit faire au maximum ${Room.ROOM_DESCRIPTION_MAX_LENGTH} caractères`;

}

module.exports = InputValidationMessage;