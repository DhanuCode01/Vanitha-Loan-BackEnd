export function isToken(req,res){
if (req.user==null){           //if you have a token
    res.status(401).json({
        Message:"pleace login and Try again"   
    })
    return
}
}