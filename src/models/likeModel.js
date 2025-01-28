import mongoose ,{Schema} from "mongoose"

const likeSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    blog: { type: Schema.Types.ObjectId, ref: 'Blog' , required: true},
  });

  const Like = mongoose.model("Like", likeSchema);

  export default Like;