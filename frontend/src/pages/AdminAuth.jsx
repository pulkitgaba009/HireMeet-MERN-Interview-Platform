function AdminAuth() {
  return (
    <div className="min-h-screen bg-linear-to-br from-neutral to-black text-base-content flex justify-center items-center">
      <form action="" className="card w-100 h-70 border border-primary/5 backdrop-blur-xl flex justify-evenly items-center">
        <h1 className="text-2xl card-title">Admin Authentication</h1>
        <input type="text" placeholder="admin name" className="input"/>
        <input type="password" placeholder="password" className="input" />
        <button type="submit" className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl w-[80%] py-5">Authenticate</button>
      </form>
    </div>
  )
}

export default AdminAuth
