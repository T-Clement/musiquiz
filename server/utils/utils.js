
 exports.generatePasswordHash = async (password, saltRounds) => {
    
    const bcrypt = require('bcrypt');

    try {

        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);

        return hash;

    } catch (err) {
        console.error('Error generating password hash:', err);
        throw err;
    }
    
};