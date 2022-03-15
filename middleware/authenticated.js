/**
 * 验证是否登录的中间件
 * 中间件需要在middleware文件夹里面，文件名就是中间件名字
 */
export default function ({ store, redirect }) {
  // If the user is not authenticated
  if (!store.state.user) {
    return redirect('/login')
  }
}
