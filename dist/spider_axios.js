import axios from "axios";
(async () => {
    const res = await axios.get("https://www.baidu.com/");
    console.log(res.data);
})();
