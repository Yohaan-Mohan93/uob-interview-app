import express from "express";
import cors from "cors";

const app = express();
app.use(cors({orgin: "http://localhost:5173"}));
app.use(express.json)

const USER_ID_REGEX = /^[A-Za-z0-9]{5}$/;
const Apps = [
    {appId: "userapp1", name: "User App 1"},
    {appId: "userapp2", name: "User App 2"},
    {appId: "userapp3", name: "User App 3"}
]
var users = new Map([
    ["ABC1",{
        apps: {
            userapp1:{role:"Admin",hasAccess:true},
            userapp2:{role:"User",hasAccess:true},
            userapp3:{role:"None",hasAccess:false}
        }
    }],
    ["ABC2",{
        apps: {
            userapp1:{role:"Admin",hasAccess:true},
            userapp2:{role:"Admin",hasAccess:true},
            userapp3:{role:"Admin",hasAccess:false}
        }
    }]
]);
var recertUserMap = new Map();


function validateUserId(userId){
    if(typeof userId !== "string" || !USER_ID_REGEX.test(userId) ){
        const err = new Error("User ID must be a string")
        err.status = 400;
        throw err;
    }
    return userId;
}

app.get("/api/permissions/listuser/:userId",(req,res,next)=>{
    try{
        const userId = validateUserId(req.params.userId);
        if(!users.has(userId)){
            const err = new Error("User ID cannot be found")
            err.status = 400;
            throw err;
        }

        const user = users.get(userId);
        res.json({userId: user.userID, apps: user.apps})
    } catch(e){
        next(e);
    }
});

app.post("/api/permissions/recertification/:userId",(req,res,next)=>{
        try{
            const userId = req.params.userId;
            const decisions = req.body ?? {};

            if(!Array.isArray(decisions) || decisions.length !== 3){
                const err = new Error("Decisions must be an array and length of 3")
                err.status = 400;
                throw err;
            }

            const validAppIds = new Set(Apps.map(a => a.appId));
            for(const d of decisions){
                if(!d || typeof d !== "object"){
                    const err = new Error("Each decision should be an object")
                    err.status = 400;
                    throw err;
                }
                if(!validAppIds.had(d.appId)){
                    const err = new Error("Invalid AppId")
                    err.status = 400;
                    throw err;
                }
                if(d.decision !== "CERTIFY" && d.decision !== "DELETE"){
                    const err = new Error("invalid decision")
                    err.status = 400;
                    throw err;
                }
            }

            const timestamp = new Date().toISOString();
            const record = {
                userId,
                decisions,
                timestamp
            };

            if(!recertUserMap.has(userId)) recertUserMap.set(userId,[])
            recertUserMap.get(userId).push(record);

            const userAccess = users.get(userId);
            if(userAccess){
                for(const d of decisions){
                    if(d.decision === "RECERTIFY"){
                        userAccess.apps[d.appId].hasAccess=true;
                    }
                }
            }

            res.status(200).json({userId: userId, action: "recertify",status:"success"});

        } catch (e){
            next(e);
        }
    });
    
    app.post("/api/permissions/recertification/:userId",(req,res,next)=>{
        try{
            const userId = req.params.userId;
            const decisions = req.body ?? {};

            if(!Array.isArray(decisions) || decisions.length !== 3){
                const err = new Error("Decisions must be an array and length of 3")
                err.status = 400;
                throw err;
            }

            const validAppIds = new Set(Apps.map(a => a.appId));
            for(const d of decisions){
                if(!d || typeof d !== "object"){
                    const err = new Error("Each decision should be an object")
                    err.status = 400;
                    throw err;
                }
                if(!validAppIds.had(d.appId)){
                    const err = new Error("Invalid AppId")
                    err.status = 400;
                    throw err;
                }
                if(d.decision !== "CERTIFY" && d.decision !== "DELETE"){
                    const err = new Error("invalid decision")
                    err.status = 400;
                    throw err;
                }
            }

            const timestamp = new Date().toISOString();
            const record = {
                userId,
                decisions,
                timestamp
            };

            if(!recertUserMap.has(userId)) recertUserMap.set(userId,[])
            recertUserMap.get(userId).push(record);

            const userAccess = users.get(userId);
            if(userAccess){
                for(const d of decisions){
                    if(d.decision === "RECERTIFY"){
                        userAccess.apps[d.appId].hasAccess=true;
                    }
                }
            }

            res.status(200).json({userId: userId, action: "recertify",status:"success"});

        } catch (e){
            next(e);
        }
    });

    app.post("/api/permissions/remove_user/:userId",(req,res,next)=>{
        try{
            const userId = req.params.userId;
            const decisions = req.body ?? {};

            if(!Array.isArray(decisions) || decisions.length !== 3){
                const err = new Error("Decisions must be an array and length of 3")
                err.status = 400;
                throw err;
            }

            const validAppIds = new Set(Apps.map(a => a.appId));
            for(const d of decisions){
                if(!d || typeof d !== "object"){
                    const err = new Error("Each decision should be an object")
                    err.status = 400;
                    throw err;
                }
                if(!validAppIds.had(d.appId)){
                    const err = new Error("Invalid AppId")
                    err.status = 400;
                    throw err;
                }
                if(d.decision !== "CERTIFY" && d.decision !== "DELETE"){
                    const err = new Error("invalid decision")
                    err.status = 400;
                    throw err;
                }
            }

            const timestamp = new Date().toISOString();
            const record = {
                userId,
                decisions,
                timestamp
            };

            if(!recertUserMap.has(userId)) recertUserMap.set(userId,[])
            recertUserMap.get(userId).push(record);

            const userAccess = users.get(userId);
            if(userAccess){
                for(const d of decisions){
                    if(d.decision === "DELETE"){
                        userAccess.apps[d.appId].hasAccess=false;
                        userAccess.apps[d.appId].role="None";
                    }
                }
            }

            res.status(200).json({userId: userId, action: "delete",status:"success"});
        } catch (e){
            next(e);
        }
    });

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, ()=> console.log("applicaiton is listening on localhost:3001"))
