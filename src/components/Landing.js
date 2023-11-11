    import React, { useState, useEffect } from 'react';
    import { useTable } from 'react-table';
    import xlsx from 'xlsx/dist/xlsx.full.min.js';
    import './css/landing.css';
    import xlxxx from '../docs/allcompanies.xlsx';

    function Landing() {  
        
        
        const [tableData, setTableData] = useState([]);

        useEffect(() => {
        const fetchData = async () => {
            try {
            const response = await fetch(xlxxx);
            const data = await response.arrayBuffer();
            const workbook = xlsx.read(data, { type: 'array' });

            // Iterate over all sheet names in the workbook
            const sheetNames = workbook.SheetNames;
            const allData = [];

            sheetNames.forEach((sheetName) => {
                const sheet = workbook.Sheets[sheetName];
                const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
                allData.push({ sheetName, data: jsonData });
            });

            setTableData(allData);
            } catch (error) {
            console.error('Error fetching Excel data:', error);
            }
        };

        fetchData();
        }, []); // Empty dependency array to run the effect only once

        const columns = React.useMemo(
        () =>
            tableData.length > 0 &&
            Object.keys(tableData[0].data[0]).map((key) => ({
            Header: key,
            accessor: key,
            })),
        [tableData]
        );

        const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({
            columns: columns || [],
            data: tableData.length > 0 ? tableData[0].data : [],
        });

        // Custom cell renderer to handle email and website links
        const CellRenderer = ({ cell }) => {
            const value = cell.value;
        
            // Helper function to render anchor elements for emails and websites
            const renderLinks = (value) => {
                // Convert the value to a string to handle non-string values
                const text = String(value);
                const parts = text.split(/(\s+)/); // Split text by spaces
            
                return parts.map((part, index) => {
                if (isValidEmail(part)) {
                    return <a key={index} href={`mailto:${part}`}>{part}</a>;
                } else if (isValidWebsite(part)) {
                    // Add "https://" if it's a valid website without a protocol
                    const websiteLink = part.startsWith('http') ? part : `https://${part}`;
                    return <a key={index} href={websiteLink} target="_blank" rel="noopener noreferrer">{part}</a>;
                } else {
                    return part;
                }
                });
            };
        
            return <>{renderLinks(value)}</>;
        };

        // Helper function to check if the string is a valid email address
        const isValidEmail = (value) => {
        // Use a simple email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
        };

        // Helper function to check if the string is a valid website URL
        const isValidWebsite = (value) => {
        // Use a simple URL validation regex
        const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-zA-Z]{2,6})(\/\S*)?$/;
        return urlRegex.test(value);
        };

    return (
        <>
        <div className='made-by'>
            Made By{' '}
            <a target='_blank' href='https://abdulrhmanelsawy.github.io/abdelrhman-elsawy/'>
            {' '}
            Abdelrhman Elsawy{' '}
            </a>
        </div>
        <section className='landing'>
            <div className='container-fluid'>
            <div className='landing-content'>
                <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
                <div className='generalinputs'>
                    <div className='another-tools'>
                    <h6>Another Tools</h6>
                    <a href='https://abdulrhmanelsawy.github.io/ChormaSelect/'>Chroma Select</a>
                    <a href='https://abdulrhmanelsawy.github.io/FormatFlipper/'>Format Flipper</a>
                    <a href='https://abdulrhmanelsawy.github.io/PixelWise-Resize/'>Pixelwise resize</a>

                    </div>
                    <h1> Programming Company Finder </h1>
                </div>
                </div>
                <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
                <div className='data-table'>
                {tableData.map((sheet, index) => (
                <div key={index}>
                <h2>{sheet.sheetName}</h2>
                <table {...getTableProps()}>
                    <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => (
                                <td {...cell.getCellProps()}>{<CellRenderer key={cell.column.id} cell={cell} />}</td>
                            ))}
                            </tr>
                        );
                        })}
                    </tbody>
                </table>
                </div>
            ))}
                </div>
                </div>
            </div>
            </div>
        </section>
        </>
    );
    }

    export default Landing;
