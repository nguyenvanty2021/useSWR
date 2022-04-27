import useSWR from "swr";

const useProduct = (productId) => {
    // getAllProduct
    // nếu api cần truyền vào header accessToken
    // const { data, error } = useSWR(['/product', token])
    const { data, error } = useSWR(productId ? `/product/${productId}` : '/product', {
        // cho thuộc tính: revalidateOnFocus này = false thì khi click qua tab khác và quay lại tab này (hay nói cách khác là tab có UI này) thì nó sẽ không gọi lại api nữa
        // nói dễ hiểu hơn là: khi cho bằng true mình đi đâu đó or không động đến chuột thi khi mình quay lại click vào màn hình useSWR nó sẽ tự động call lại API getAll này -> = false để tắt chức năng này đi
        // thuộc tính: dedupingInterval có tác dụng giữ lại data cũ trong vòng bao nhiêu giây mà không phải fetch (call) lại data mới
        // như VD thì mình đang để 1 giờ, thì trong vòng 1 giờ khi mình click qua những trang khác rồi back lại trang này data vẫn giữ nguyên không thay đổi
        // không phải fetch hay call lại api
        // dedupingInterval: MILLISECOND_PER_HOUR,
        // công dụng của refreshInterval là cứ sau bao nhiêu giây thì sẽ call lại api này 1 lần (default là 0)
        // refreshInterval: 600000, // 10 minutes // 3000 = 3s
        // muốn set 1 array or 1 object default thì dùng thuộc tính này
        // fallbackData: [] or {}
        // dùng suspense khi không muốn hiện loading nữa, khi nào có đủ data rồi mới render lên UI
        // suspense: true
        shouldRetryOnError: (error) => {
            // khi api bị lỗi không call lại nữa nếu error trả về là lỗi 404
            if (error.status === 404) return false
            return true
          }
    });
    return {
        product: data,
        loading: !error && !data,
        error: error
    }
}
const useProductByPagination = (page, limit) => {
    const { data, error } = useSWR(`/product/pagination?page=${page}&limit=${limit}`);
    return {
        productPagination: data,
        loadingPagination: !error && !data,
        errorPagination: error
    }
}
const useProductSearch = (search) => {
    const { data, error } = useSWR(`/product/search?q=${search}`, {
        // VD: khi mình search ip11, nó sẽ show ra hết all product chứa key 'ip11' nhưng khi xoá key này khỏi input thì nó vẫn còn hiện mờ
        // Example: https://user-images.githubusercontent.com/3676859/163695903-a3eb1259-180e-41e0-821e-21c320201194.mp4
        // Dùng cho trường hợp search call api
        keepPreviousData: true
    });
    return {
        productSearch: data,
        loadingSearch: !error && !data,
        errorSearch: error
    }
}
export {
    useProduct,
    useProductByPagination,
    useProductSearch
}