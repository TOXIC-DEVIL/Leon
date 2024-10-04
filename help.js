const{RsnChat}=require("rsn chat");
let {gpt}=newRsnChat('rsnai_77URql4VkEeS0VenuWccfgk5');
let res=await gpt("there is a bot named leon a whatsapp bot in which you are assigned to be an assistant of the owner"+mssg.text);
await mssg.replay(res.message);
