const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Product } = require('../models/Product');


//==============================
//            Product
//==============================


var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`)
        // cb(null, file.fieldname + '-' + Date.now());
        // filename을 어떤 이름으로 저장할 지 체크해준다.
    }
});

// var upload = multer({ storage: storage });
var upload = multer({ storage: storage }).single("file");

router.post('/image', (req, res) => {
    
    // 가져온 이미지를 저장을 해주면 된다.
    // image를 보낸 것을 여기에서 저장을 해준다. multer라는 것을 사용한다.
    // multer 라이브러리를 다운로드 받는다. <-- Server dependencies이다.
    // root 디렉토리에서 다운로드 받는다.
    upload(req, res, err => {
        if (err) {
            console.log("false : ", req.json);
            // 파일 저장에 실패했을 때, false
            return req.json({ success: false, err });
        }
        // 파일 저장에 성공할 때, true
        console.log("true : ", res.json)
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.name });
        // 
        // 두 가지 파일 저장하는 방법, 파일을 어디에 전달하는 지 알려준다.
        // backend에서 frontend로 저장하는 것을 한다. 전달
    });
});

router.post('/', (req, res) => {
    // '/product' End-Point라고 한다. --> '/' root
    
    // 받아온 정보들을 DB에 넣어준다.
    const product = new Product(req.body);
    // 새로운 객체를 만들어준다.
    // product 콜렉션

    product.save((err) => {

        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).json({ success: true })
        
        // if(err) return res.status(400).json({ success: false, err });
        // return res.status(200).json({ success: true });
    });
    // 넣어준 정보들을 자동적으로 Product 콜렉션 안에 저장된다.
});

router.post('/products', (req, res) => {

    // product collection에 들어 있는 모든 상품 정보를 가져오기

    let limit = req.body.limit ? parseInt(req.body.limit) : 20;
    // limit이 있다고 가정, ? --> parseInt(req.body.limit)
    // limit 지정해준 값, parseInt -> String인 경우 숫자로 바꾸어준다.
    // limit이 있다면 --> ?, parseInt(req.body.limit) : 20;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    // 0이면 처음부터 시작한다.
    let term = req.body.searchTerm
    // let term = "maxico"가 들어온다.


    // 조건을 합해서 프로덕트 콜렉션에서 가져와야 한다. 변형해준다.
    let findArgs = {};
    // console.log('findArgs : ', findArgs);

    // Object를 정의해준다. {}
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            
            console.log('key = ', key)

            if (key === "price") {
                findArgs[key] = {
                    // findArgs[price]
                    // Greater than equal
                    // MongoDB에서 사용하는 것이다.
                    // ex. $gte: 200. '크거나 같은'
                    // [key][0] 첫 번째 인덱스
                    $gte: req.body.filters[key][0],
                    // Less than equal
                    // ex. $lte: 249 '작거나 같은'
                    // [key][1] 두 번째 인덱스
                    $lte: req.body.filters[key][1],
                }
            } else {
                findArgs[key] = req.body.filters[key];
            }

            findArgs[key] = req.body.filters[key];
        }
    }

    // findArgs(findArgments)가 무엇인지를 console.log로 확인해준다.
    console.log('findArgs = ', findArgs);

    // 필터 처리
    // Product.find(findArgs)
    //     .populate("writer")
    //     .skip(skip)
    //     .limit(limit)
    //     .exec((err, prodctInfo) => {
    //         if (err) return res.status(400).json({ success: false, err })
    //         return res.status(200).json({
    //             success: true, productInfo,
    //             postSize: productInfo.length
    //         })
    //     });

    if(term) {
        Product.find(findArgs)
            .find({ $text: { $search: term } })
            .populate("writer")
            .skip(skip)   // 0개
            .limit(limit) // 8개
            .exec((err, productInfo) => {
                if (err) return res.status(400).json({ sucess: false, err })
                return res.status(200).json({
                    success: true, productInfo,
                    postSize: productInfo.length
                });
            });
    } else {
        Product.find(findArgs)
        // Product 콜렉션에서 데이터를 가지고 올 때 
        // Product 콜렉션 안에 모든 데이터베이스를 찾는다.
        // module - Product, find - Method
        // product.find({price}) <-- 오브젝트 형식, 조건을 넣어서 입력.
        // product 안에 있는 모든 컬렉션을 찾아본다.
            .populate("writer")
            // 모든 정보를 가져온다.
            // 상품을 등록한 사람의 정보 --> Unique한 아이디에 대한 정보 | 이메일, 이미지, 주소
            .skip(skip)
            // 지정된 것이 0번 째이다.
            .limit(limit)
            // mongoDB에 알려준다.
            // 8개만 가져온다. --> (8)
            .exec((err, productInfo) => {
                // query를 돌린다.
                if (err) return res.status(400).json({ success: false, err })
                // [{}, {}, {}] product안에 Obejct가 있는 것을 확인 
                // 데이터 베이스에서 3 개의 상품을 가져온 것을 알 수 있다.
                // productInfo.length === 3
                return res.status(200).json({ 
                    success: true, productInfo, 
                    postSize : productInfo.length
                })
            })
    }
});

// id=123123123, 4242323, 123123124124 type=array
router.get('/products_by_id', (req, res) => {

    let type = req.query.type
    // type은 req.body가 아닌 req.query이다.
    let productIds = req.query.id
    // req.query --> query로 가져온다.

    if (type === "array") {
        // id=123123123, 4242323, 123123124124 이것을
        // productIds = ['123123123', '345345345', '2323123423'] 이런 식으로 바꾸어주기
        let ids = req.query.id.split(',')
        productIds = ids.map(item => {
            return item
        });
    }
    // productId를 사용해서 DB에서 productId와 같은 상품의 정보를 가져온다.
    // Product.find({ _id: productIds })
    Product.find({ _id: { $in: productIds } })
        // Product 모델을 가져온다.
        .populate('writer')
        // writer의 모든 정보를 가져온다.
        .exec((err, product) => {
            // exec 쿼리를 돌려준다.
            // 실패할 경우
            if(err) return res.status(400).send(err)
            // 프론트 엔드에 err의 결과값을 준다.
            // 성공할 경우
            // status를 200을 주고 product의 정보를 보내준다.
            // return res.status(200).send(product)
            return res.status(200).json({ success: true, product })
        })

});


// 위에 Product.find 메소드로 명시해줌.
// axios.get(`/api/product/products_by_id?id=${productId}&type=single`)


module.exports = router;