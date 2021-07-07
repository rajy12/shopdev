const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { Product } = require("../models/Product");

const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        history: req.user.history,
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

// post 메서드로 한다.
router.post("/addToCart", auth, (req, res) => {
    
    // 먼저 User Collection에 해당 유저의 정보를 가져오기
    User.findOne({ _id: req.user._id },
        (err, userInfo) => {

    // 가져온 정보에서 카트에다 넣으려 하는 상품이 이미 들어 있는지 확인을 한다.

            let duplicate = false;
            userInfo.cart.forEach((item) => {
                if (item.id === req.body.productId) {
                    // duplicate가 맞다면 true로 바꾸어준다.
                    duplicate = true;
                }
            })

            // 상품이 이미 있을 때
            if (duplicate) {
                // 하나를 찾은 다음에 하나를 업데이트해준다.
                User.findOneAndUpdate(
                    // 조건을 넣어준다.
                    // 사람을 찾고, 그다음에 상품을 찾는 것이다.
                    { _id: req.user._id, "cart.id": req.body.productId },
                    // 상품을 하나를 올려준다.
                    { $inc: { "cart.$.quantity": 1 } },
                    // 쿼리를 돌려서 결과 값
                    { new: true },
                    // 에러가 날 경우
                    (err, userInfo) => {
                        // 실패할 경우
                        if (err) return res.status(400).json({ success: false, err })
                        // 성공할 경우
                        res.status(200).send(userInfo.cart)
                    }
                )
            } 
            
            // 상품이 이미 있지 않을 때
            else {
                User.findOneAndUpdate(
                    // 유저를 찾는다.
                    { _id: req.user._id },
                    {
                        // 데이터 0, 1, 2 --> 밀어넣어준다.
                        $push: {
                            cart: {
                                // id
                                id: req.body.productId,
                                // quantity
                                quantity: 1,
                                // date를 해주면 자동으로 date를 만들어준다.
                                date: Date.now()
                            }
                        }
                    },
                    // 업데이트된 데이터를 받는다.
                    { new: true },
                    // query를 돌린다.
                    // userInfo = UserInformation
                    (err, userInfo) => {
                        // 실패를 한 경우
                        if (err) return res.status(400).json({ success: false, err })
                        // 성공을 했다면
                        res.status(200).send(userInfo.cart)
                    }
                )
            }
        })
});

router.get('/removeFromCart', auth, (req, res) => {

    // 먼저 cart 안에 내가 지우려고 한 상품을 지워주기
    User.findOneAndUpdate(
        { _id: req.user._id },
        {
            "$pull":
                { "cart": { "id": req.query.id } }
        },
        { new: true },
        (err, userInfo) => {
            let cart = userInfo.cart;
            let array = cart.map(item => {
                return item.id
            })

            // Product Collection에서 현재 남아있는 상품들의 정보를 가져오기

            // ProductIds = [ '', '' ] 이런 식으로 바꿔주기

            Product.find({ _id: { $in: array } })
            .populate('writer')
            .exec((err, productInfo) => {
                return res.status(200).json({
                    productInfo,
                    cart
                })
            })
            
        }
    )
})

module.exports = router;
