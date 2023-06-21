import mongoose, {Schema} from 'mongoose';

const transactionSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    UTR:{
        type:String,
    },
    amount:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        enum:["Pending","Success","Failed"],
        default:"Pending"
    },
    transactionType:{
        type:String,
        enum:["Withdrawal","Deposit","PriceMoney","JoinGame"]
    },
    discription:{
        type:String,
    },
    accountHolderName:{
        type:String,
    },
    accountNumber:{
        type:Number,
    },
    bankName:{
        type:String,
    },
    IFSC_code:{
        type:String
    }


    
},{timestamps:true,})

transactionSchema.virtual('id').get(function(){
    return this._id;
});
transactionSchema.set('toJSON', {
    virtuals: true
});

export default mongoose.model("Transaction",transactionSchema);