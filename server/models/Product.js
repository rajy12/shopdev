const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        default: 0,
    },
    images: {
        type: Array,
        default: []
    },
    // 얼마나 팔렸는지 확인한다.
    sold: {
        type: Number,
        maxlength: 100,
        default: 0
    },

    continents: {
        type: Number,
        default: 1,
    },

    // 얼마나 보았는지를 확인한다.
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

productSchema.index({ 
    title: 'text',
    description: 'text',
}, {
    weights: {
        title: 5,
        description: 1,
    }
});

// const productSchema = mongoose.Schema({
//     writer: {
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     title: {
//         type: String,
//         maxlength: 50
//     },
//     description: {
//         type: String,
//     },
//     price: {
//         type: Number,
//         default: 0
//     },
//     images: {
//         Type: Array,
//         default: []
//     },
//     sold: {
//         type: Number,
//         maxlength: 100,
//         default: 0
//     },
//     // 몇개가 팔렸는지에 대한 정보
//     views : {
//         type: Number,
//         default: 0
//     },
//     // 사람들이 얼마나 보았는지에 대한 정보
// }, { timestamps: true });
// 자동으로 업데이트 등록 정보(등록 시간)가 업데이트 된다.

const Product = mongoose.model('Product', productSchema);

module.exports = { Product }