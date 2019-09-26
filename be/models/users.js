const mongoose = require('mongoose');
const cfg = require('../../config')

mongoose.set('useCreateIndex', true)
const comSchema = new mongoose.Schema({ // 부대 정보 스키마, 나중에 따로 분리해야함
  name: { type: String, default: '', index: true },
  phoneNumber: { type: String, default: '', index: true }
});

const userSchema = new mongoose.Schema({
  id: { type: String, default: '', unique: true, index: true },  
  pwd: { type: String, default: '' },
  name: { type: String, default: ''},
  age: { type: Number, default: 1 },
  lv: {type: Number, default: 2},
  company: {
    name: { type: String, default: ''},
    phoneNumber: {type: String, default: ''}
  },
  inCnt: { type: Number, default: 0 }, //add
  retry: { type: Number, default: 0 }
});

const User = mongoose.model('User', userSchema)

// User.collection.dropIndexes('id_1')
User.findOne({ id: cfg.admin.id }) // admin계정이 없을 경우 생성하는 구문, 있으면 생성 X
  .then((r) => {
    if (!r) return User.create({ id: cfg.admin.id, pwd: cfg.admin.pwd, name: cfg.admin.name, company: cfg.admin.company })
    return Promise.resolve(null)
  })
  .then((r) => {
    if (r) console.log(`admin:${r.id} created!`)
  })
  .catch((e) => {
    console.error(e.message)
  })

// 유저 회원가입 대체 구문
// User.create({ id: 'rlawkddud2', pwd: 'kjy0108', name: '김장영', company: cfg.admin.company})
//   .then((r) => {
//     console.log(r)
//   })
//   .catch((e) => console.error(e))

module.exports = User