const Theme = require('../models/Theme');

const { validationResult, matchedData } = require("express-validator");



exports.show = async (req, res, next) => {
    // get theme id placed as param in GET request
    const themeId = parseInt(req.params.id);

    if(!themeId) {
        return next(new Error("Param missing in Theme get request"));
        
    }

    try {
        const theme = await Theme.findOneThemeById(themeId);

        if(!theme) {
            return res.status(404).json({ message: "Theme not found" });
        }

        res.status(200).json(theme);

    } catch(error) {
        res.status(500).json({ message : "Servor Error" });
        next(error);
    }

}


exports.getAllThemes = async (req, res, next) => {
    try {
        const themes = await Theme.getThemes();

        if(!themes) {
            return res.status(404).json({ message: "Themes not found" });
        }


        res.status(200).json(themes);
    } catch(error) {
        res.status(500).json({ message: "Servor Error" });
        next(error);
    } 
}