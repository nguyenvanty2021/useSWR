import "./App.css";
import Product from "./components";
function App() {
  return (
    <div>
      {/* nếu thông thường thì khi gọi 3 lần Product như vậy nó sẽ call 3 api liên tiếp
      nhưng vì bên trong mỗi Product này đều có useSWR thằng SWR này nó sẽ phát hiện ra được cả 3 thằng này đều call cùng 
      1 api get product by id (với id ở đây là 1) nên nó chỉ call api get product by id = 1 chỉ duy nhất 1 lần mà thôi và khi api respon data về thì lúc này thằng useSWR này
      sẽ show ra data cả 3 thằng cùng 1 lúc */}
      {/* giống debound api trong saga */}
      {/* -> 2 cách này giúp giải quyết dc tình trạng call 1 lúc cùng 1 api quá nhiều lần dẫn đến loop api  */}
      <Product productId='1' />
      <Product productId='1' />
      <Product productId='1' />
    </div>
  );
}

export default App;
