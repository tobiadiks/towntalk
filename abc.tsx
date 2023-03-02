import React, { useEffect, useState } from 'react'
import '../../sass/detail.scss'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Select, Spin, Space } from 'antd'
import { useDispatch } from 'react-redux'
import { ADD } from '../../redux/actions/action'
import { API } from '../../config/config'

const { Option } = Select
const Detailpage = () => {
  const [data, setData] = useState([])
  const [loader, setLoader] = useState(false)
  const [RealtedProducts, setRealtedProducts] = useState([])
  const params = useParams()
  const dispatch = useDispatch()
  const [selected, setSelected] = useState('')
  const send = (product, selectedproduct) => {
    const result = product.varients.filter(
      item => item.id === parseInt(selectedproduct.charAt())
    )
    console.log(result)
    result.length &&
      dispatch(
        ADD({
          id: result[0].id,
          image: product.image,
          price: parseInt(result[0].price),
          product_id: parseInt(result[0].product_id),
          varient_id: parseInt(result[0].id),
          size: result[0].size,
          name: product.name
        })
      )
  }

  useEffect(() => {
    axios
      .get(API + 'specificProduct/' + params.item)
      .then(res => {
        setData(res.data.Product)
        setLoader(true)
        // console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
    axios
      .get(API + 'relatedProduct/' + params.item)
      .then(res => {
        setRealtedProducts(res.data.Related)
        setLoader(true)
        // console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }, [params.item])
  // useEffect(() => {}, [params.item])

  function handleChange (value) {
    setSelected(value)
  }

  return (
    <div className='detailMain'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-12'>
            <div className='detailCont'>
              {loader ? (
                data.map((product, index) => (
                  <div key={index} className='row'>
                    <div className='col-md-6'>
                      <div className='imgBox'>
                        <img
                          className='img-fluid'
                          src={product.image}
                          alt='pizza'
                        />
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='detailBox'>
                        <h2>{product.name}</h2>
                        <p>{product.description}</p>
                        <h3>Size:</h3>
                        <div className='select-size'>
                          <Select
                            style={{ width: 300 }}
                            onChange={e => handleChange(e)}
                            value={!selected ? 'Choose an option' : selected}
                          >
                            {product.varients.map((item, index) => (
                              <Option
                                key={index}
                                value={
                                  item.id +
                                  ':' +
                                  item.size +
                                  '-' +
                                  '€' +
                                  item.price
                                }
                              ></Option>
                            ))}
                          </Select>
                        </div>
                        <div className='quantity'>
                          {/* <div className='quntitybox'>
                            <button className='btn btn-default'>
                              <span>-</span>
                            </button>
                            <span>{product.quantity}</span>
                            <button className='btn btn-default'>+</button>
                          </div> */}
                          <div>
                            <button
                              onClick={() => send(product, selected)}
                              className='btn btn-success cartBtn'
                            >
                              <i className='fa fa-shopping-cart'></i>
                              Add to cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <Space className='spinner'>
                  <Spin size='large'></Spin>
                </Space>
              )}

              <div className='related'>
                <h2>Related Products:</h2>
                <div className='row'>
                  {loader ? (
                    RealtedProducts.map((item, index) => (
                      <div key={index} className='col-md-3'>
                        <div className='related-products'>
                          <img
                            className='img-fluid'
                            src={item.image}
                            alt='items'
                          />
                          <h3>{item.name}</h3>
                          <p>{item.description}</p>
                          {item.varients.map((ele, index) => (
                            <h2 key={index} className='ele-price'>
                              €{ele.price}
                            </h2>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <Space className='spinner'>
                      <Spin size='large'></Spin>
                    </Space>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Detailpage