const fs = require('fs');

module.exports = {
    command: 'view',
    info: 'Saves view once image or video',
    func: async (sock, msg, text) => {
        if (!msg.replied) return await msg.reply({ text: '*Please reply to a viewonce video or image!*' });
        
        const viewOnceContent = msg.replied.viewOnceMessage.message;
        console.log("View once content:", viewOnceContent);
        
        
        let media;
        let replyObject;
        let tempFileName;

        if (viewOnceContent.imageMessage) {
            media = await msg.load(viewOnceContent.imageMessage);
            tempFileName = 'viewonce_image.jpg';
            fs.writeFileSync(tempFileName, media);
            replyObject = { image: fs.readFileSync(tempFileName) };
        } else if (viewOnceContent.videoMessage) {
            media = await msg.load(viewOnceContent.videoMessage);
            tempFileName = 'viewonce_video.mp4';
            fs.writeFileSync(tempFileName, media); 
            replyObject = { video: fs.readFileSync(tempFileName) }; 
        } else {
            return await msg.reply({ text: "not a viewonce image or video" });
        }

        await msg.reply(replyObject);
        fs.unlinkSync(tempFileName);
    }
};
