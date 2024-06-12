import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Header from '../components/Header';
import './View.css';
import { useNavigate } from 'react-router-dom';

const View = () => {
    const navigate = useNavigate();
    
    const [record, setRecord] = useState([]);
    const [selectRecords, setSelectRecords] = useState([]);
    const [status, setStatus] = useState("");
    const [filterrecord, setFilterRecord] = useState([]);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");

    useEffect(() => {
        let data = localStorage.getItem("users") ? JSON.parse(localStorage.getItem("users")) : [];
        setRecord(data);
        setFilterRecord(data);
    }, []);

    // Delete 
    const handleDelete = (id) => {
        const deleteRecords = record.filter(item => item.id !== id);
        localStorage.setItem("users", JSON.stringify(deleteRecords));
        setRecord(deleteRecords);
        setFilterRecord(deleteRecords);
        toast.error("User deleted successfully!");
    };

    // Handle selection of users for multiple delete
    const handleSelect = (id) => {
        if (selectRecords.includes(id)) {
            setSelectRecords(selectRecords.filter(recordId => recordId !== id));
        } else {
            setSelectRecords([...selectRecords, id]);
        }
    };

    // Delete selected users
    const handleDeleteSelected = () => {
        const deleteRecords = record.filter(item => !selectRecords.includes(item.id));
        localStorage.setItem("users", JSON.stringify(deleteRecords));
        setRecord(deleteRecords);
        setFilterRecord(deleteRecords);
        toast.error("Selected users deleted successfully!");
        setSelectRecords([]);
    };

    // status, search, sort
    useEffect(() => {
        let filtered = [...record];

        if (status) {
            filtered = filtered.filter(val => val.status === status);
        }

        if (search) {
            filtered = filtered.filter(item => item.firstname.toLowerCase().includes(search.toLowerCase()));
        }

        if (sort) {
            if (sort === 'asc') {
                filtered.sort((a, b) => a.firstname.toLowerCase() > b.firstname.toLowerCase() ? 1 : -1);
            } else if (sort === 'dsc') {
                filtered.sort((a, b) => a.firstname.toLowerCase() < b.firstname.toLowerCase() ? 1 : -1);
            }
        }

        setFilterRecord(filtered);
    }, [status, search, sort, record]);

    return (
        <>
            <Header />

            <div className="container">
                <div className="row">
                    <div className='box mb-3 justify-content-between'>
                        <div className="col-lg-3">
                            <select onChange={(e) => setStatus(e.target.value)} className='form-control' value={status}>
                                <option value="">---select status---</option>
                                <option value="Active">Active</option>
                                <option value="Unactive">Deactive</option>
                            </select>
                        </div>
                        <div className='col-lg-3'>
                            <form>
                                <input type="text" onChange={(e) => setSearch(e.target.value)} className='form-control' placeholder='search here' />
                            </form>
                        </div>
                        <div className='col-lg-3'>
                            <select onChange={(e) => setSort(e.target.value)} className='form-control' value={sort}>
                                <option value="">---select sorting---</option>
                                <option value="asc">A-Z</option>
                                <option value="dsc">Z-A</option>
                            </select>
                        </div>
                    </div>

                    <table className='shadow'>
                        <thead>
                            <tr>
                                <th>Select Delete</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Birth Date</th>
                                <th>Gender</th>
                                <th>Phone</th>
                                <th>Email Address</th>
                                <th>Mailing Address</th>
                                <th>City</th>
                                <th>State</th>
                                <th>Country</th>
                                <th>Job Status</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody >
                            {filterrecord.map((val) => {
                                const { id, firstname, lastname, birthdate, gender, country, phone, email, address, city, state, status } = val;
                                return (
                                    <tr key={id}>
                                        <td className='box'>
                                            <input className="form-check-input" type="checkbox" value={id} id={`checkbox-${id}`} onChange={() => handleSelect(id)} checked={selectRecords.includes(id)} />
                                        </td>
                                        <td>{firstname}</td>
                                        <td>{lastname}</td>
                                        <td>{birthdate}</td>
                                        <td>{gender}</td>
                                        <td>{phone}</td>
                                        <td>{email}</td>
                                        <td>{address}</td>
                                        <td>{city}</td>
                                        <td>{state}</td>
                                        <td>{country}</td>
                                        <td>
                                            {status === "Active" ? (
                                                <button className="btn btn-success">{status}</button>
                                            ) : (
                                                <button className="btn btn-warning">{status}</button>
                                            )}
                                        </td>
                                        <td>
                                            <button className="btn btn-info" onClick={() => navigate('/edit', { state: val })}>Edit</button>
                                        </td>
                                        <td>
                                            <button className="btn btn-danger" onClick={() => handleDelete(id)}>Delete</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="d-flex justify-content-end">
                <button className="btn btn-danger" onClick={handleDeleteSelected} disabled={selectRecords.length === 0}>Delete Selected</button>
            </div>

            <ToastContainer />
        </>
    );
}

export default View;
