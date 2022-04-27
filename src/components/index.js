import useSWR, {useSWRConfig} from "swr";
import axios from "axios";
import { useProduct, useProductByPagination, useProductSearch } from "../hooks/useProduct";
import { useState } from "react";
// cách 1
// const fetcher1 = async () => {
//   const response = await fetch('https://61d3e3feb4c10c001712bb0a.mockapi.io/product')
//   const data = await response.json()
//   return data
// }
// const {data, error} = useSWR('dashboard', fetcher1)
// cách 2
//const fetcher = (...args) => fetch(...args).then((res) => res.json());
// Typescript
//const {data, error} = useSWR<IPost>('/product', fetcher)
const Product = ({productId}) => {
  const { refreshInterval, mutate, cache, trigger, ...restConfig } = useSWRConfig()
  const [pageIndex, setPageIndex] = useState(0);
  const [search, setSearch] = useState('');
  // giải thích chi tiết ở file: swr.tsx trong folder pages
  // Ưu điểm:
  // + Khi click qua tab or phần mềm khác rồi sau đó click quay lại tab có sử dụng useSWR thì nó sẽ tự động call lại api
  // + Khi call cùng lúc 3 lần 1 api thì nó chỉ call 1 api mà thôi -> giống debound api của middle saga
  // + Khi call 1 api lỗi 1 lần nó sẽ tiếp tục call tiếp 4 lần nữa, nếu call quá 5 lần mà vẫn còn thất bại thì không call nữa
  // cách 3
  // getAllProduct
  const {error, product, loading} = useProduct()
  // trong thực tế là default dùng thằng productPagination này luôn, bỏ thằng getAllProduct ở trên -> ngoài ra cũng có thể sử dụng: useSWRInfinite của swr cũng khá là hay thay cho dùng 1 state để lưu pagination như state ở trên
  const {errorPagination, productPagination, loadingPagination} = useProductByPagination(1, 10)
  const {error: errorById, product: productById, loading: loadingById} = useProduct(productId)
  const {error: errorSearch, product: productSearch, loading: loadingSearch} = useProductSearch(search)
  //const {data, error} = useSWR('/posts?_sort=createdAt&_order=desc')
  //if ((!error && isValidating) || !data) return "Loading";
  if (error || errorById) return "An error has ocurred";
  if (loading || loadingById) return 'Loading'
  console.log(product)
  console.log(productById)
  const handleAddObjectNew = async () => {
      const objectAdd = {
        img: 'img',
        productName: 'product name 1',
        onSaleName: 'on sale name 1',
      }
      // thêm 1 object product mới vào product cũ
      const productNew = [...product, objectAdd]
      // optimisticData: data to immediately update the client cache, usually used in optimistic UI.
      // rollbackOnError: should the cache rollback if the remote mutation errors.
      // revalidate: should the cache revalidate once the asynchronus update resolves.
      const options = {optimisticData: productNew, rollbackOnError: true, revalidate: false}
      // thêm tạm object product vừa thêm lên UI nếu không có dòng axios.post ở dưới thì khi reload lại sẽ mất object vừa thêm
      mutate('/product', productNew, options)
      await axios.post('/product', objectAdd)
      //trigger('/product')
  }
  const handleDeleteObjectNew = async (id) => {
    // xoá tạm object product trên UI nếu không có dòng axios.delete ở dưới thì khi reload lại sẽ thêm lại object vừa xoá
    const productDelete = product.filter(values => values.id !== id)
    const options = {optimisticData: productDelete, rollbackOnError: true, revalidate: false}
    mutate('/product', productDelete, options)
    await axios.delete(`/product/${id}`)
  }
  const handleUpdateObjectNew = async (id) => {
    // update tạm object product trên UI nếu không có dòng axios.put ở dưới thì khi reload lại data sẽ trở lại object cũ
    const index = product.findIndex((values) => values.id === id)
    if(index > -1) {
        const objectNew = {...product[index], productName: 'ty dep trai'}
        const productNew = [...product]
        productNew[index] = objectNew
        const options = {optimisticData: productNew, rollbackOnError: true, revalidate: false}
        mutate('/product', productNew, options)
        await axios.put(`/product/${id}`,  objectNew)
    }
  }
  return (
    <div className="App">
    <button onClick={handleAddObjectNew} >Add 1 object</button>
      {product?.length > 0 && product.map((values, index) => {
        return <div key={index} >
            <div>{values.productName}</div>
            <button onClick={() => handleDeleteObjectNew(values.id)} >Delete 1 object</button>
            <button onClick={() => handleUpdateObjectNew(values.id)} >Update 1 object</button>
        </div>;
      })}
    <button onClick={() => setPageIndex(pageIndex - 1)}>Previous</button>
    <button onClick={() => setPageIndex(pageIndex + 1)}>Next</button>
    <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
      />
    </div>
  );
};
export default Product;
