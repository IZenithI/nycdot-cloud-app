const mongoose = require('mongoose');

const DataSchema = mongoose.Schema({
    FID: Number,
    Id: String,
    Comments: String,
    ImageID: String,
    ImageDat: String,
    Link: String,
    XY: String,
    Section: String,
    OnStreet: String,
    CrossStreet1: String,
    CrossStreet2: String,
    PostType: String,
    PedestrianArm: String,
    NoArms: Number,
    PostColor: String,
    LuminaireType: String,
    TeardropType: String,
    AttachmentType1: String,
    AttachmentType2: String,
    AttachmentType3: String
})

module.exports = mongoose.model('Data', DataSchema);