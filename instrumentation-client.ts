// Vercel BotID: attaches the browser challenge to form posts; app/api/inquiry/route.ts verifies it with checkBotId().
import { initBotId } from "botid/client/core";

initBotId({ protect: [{ path: "/api/inquiry", method: "POST" }] });
