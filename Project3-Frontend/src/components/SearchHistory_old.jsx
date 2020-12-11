// import React, { useState, useEffect } from 'react';
// import { Card } from 'react-bootstrap';
// import { Button } from 'react-bootstrap';
// import { FaEdit, FaSpinner } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";


// const SearchHistoryOld = (props) => {
//     useEffect(() => {
//         if (props.history && props.history.length > 0) {
//             setSavedData(props.history)
//         }
//     })
//     const [data, setData] = useState([])

//     const [savedData, setSavedData] = useState([])

//     const saveDataToBackend = (i, item) => {
//         let tempSaved = JSON.parse(JSON.stringify(data))
//         tempSaved.push(item.location)
//         setData(
//             tempSaved
//         )
//         checkEditVariable()
//         // setTimeout(() => {
//         //     setSavedData(
//         //         allDataArray
//         //     )
//         //     setIsSpin(false)
//         // }, 2000)
//     }

//     const checkEditVariable = (location) => {
//         console.log("data", data)
//         console.log(savedData)
//         let value = false
//         if (data && data.length > 0) {
//             // data.forEach(y => {
//             //     let index = savedData.findIndex(x => x["location"] === y)
//             //     if (index !== -1) {
//             //         value = true
//             //     }
//             // })
//             if (data.includes(location)) {
//                 return true
//             }
//         }
//         return value
//     }

//     const [setted, setSetted] = useState(false);

//     const [isSpin, setIsSpin] = useState(false)

//     return (

//         <>
//             {isSpin && <div className="loading">
//                 <div className="loader"></div>
//             </div>}

//             {savedData && savedData.length > 0 && savedData.map((item, i) => {
//                 return (
//                     <>


//                         <Card key={i} border="primary" style={{ width: '18rem' }}>
//                             <Card.Header style={{ fontsize: '30px', fontWeight: 'bold', color: 'black' }}>{item.type}
//                                 {!checkEditVariable(item.location) && <Button variant="success float-right" type="submit"
//                                     onClick={() => saveDataToBackend(i, item)}
//                                 >
//                                     Save
//             </Button>}
//                             </Card.Header>
//                             <Card.Body>
//                                 <Card.Title style={{ color: 'red' }}>{item.riskArea}
//                                     {checkEditVariable(item.location) && <MdDelete />}</Card.Title>
//                                 <Card.Text>
//                                     <a href="https://goo.gl/maps/uw3y78Md81Dim72H6">{item.location}</a>
//                                     {checkEditVariable(item.location) && <FaEdit style={{ backgroundColor: "yellow" }} />}
//                                 </Card.Text>
//                             </Card.Body>
//                         </Card >
//                     </>
//                 )
//             })}

//         </>
//     )

// }

// export default SearchHistoryOld