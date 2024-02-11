import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import pako from 'pako';
import { getAuth, signOut } from "firebase/auth";
import { auth } from '../utils/authLogin';
import './homestyle.css';
import Login from './Login';

const FileCompressor = () => {
    const [file, setFile] = useState(null);
    const [compressedFile, setCompressedFile] = useState(null);
    const [decompressedFile, setDecompressedFile] = useState(null);
    const [loading, setLoading] = useState(false); // Loading state
    const [mode, setMode] = useState('compress'); // 'compress' or 'decompress'

    const onDrop = (acceptedFiles) => {
        setFile(acceptedFiles[0]);
        setCompressedFile(null); // Reset compressedFile when a new file is dropped
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const compressFile = async () => {
        if (!file || loading) return;

        setLoading(true); // Set loading to true

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:3000/encode', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const compressedBlob = await response.blob();
                setCompressedFile(compressedBlob);
            } else {
                console.error('Error in encoding:', response.statusText);
            }
        } catch (error) {
            console.error('Error in encoding:', error.message);
        } finally {
            setLoading(false); // Set loading to false regardless of success or failure
        }
    };

    const decompressFile = async () => {
        if (!file || loading) return;

        setLoading(true); // Set loading to true

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:3000/decode', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const decompressedBlob = await response.blob();
                setCompressedFile(decompressedBlob);
            } else {
                console.error('Error in decoding:', response.statusText);
            }
        } catch (error) {
            console.error('Error in encoding:', error.message);
        } finally {
            setLoading(false); // Set loading to false regardless of success or failure
        }
    };

    const downloadFileCompressed = () => {
        if (!compressedFile || loading) return;

        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(compressedFile);
        downloadLink.download = `compressed.txt`;
        downloadLink.click();
        setCompressedFile(null);
    };
    const downloadFileDecompressed = () => {
        if (!compressFile || loading) return;

        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(compressedFile);
        downloadLink.download = `decompressed.txt`;
        downloadLink.click();
        setCompressedFile(null);
    };

    const signout = () => {
        signOut(auth).then(() => {
            <Login />
        }).catch((error) => {
            console.log("error in sign out ", error)
        });
    };

    return (
        <div className="container-fluid mt-5">
            <div className="container mt-5">
                <nav className="navbar navbar-dark bg-dark mb-4">
                    <button className={`btn btn-outline-light ${mode === 'compress' ? 'active' : ''}`} onClick={() => setMode('compress')}>
                        Compress
                    </button>
                    <button className={`btn btn-outline-light ${mode === 'decompress' ? 'active' : ''}`} onClick={() => setMode('decompress')}>
                        Decompress
                    </button>
                </nav>
                <h1 className="mb-4">File Compressor</h1>
                <div {...getRootProps()} className="dropzone mb-4">
                    <input {...getInputProps()} />
                    <p className="text-muted">Drag & drop a file here, or click to select a file</p>
                </div>
                {file && (
                    <div className="file-info-container">
                        <p className="file-info">Selected File: {file.name}</p>
                        <button className="btn btn-success mr-2" onClick={mode === 'compress' ? compressFile : decompressFile}>
                            {mode === 'compress' ? 'Compress File' : 'Decompress File'}
                        </button>
                        {loading && <p>Loading...</p>}
                        {mode === 'decompress' && (
                            <button className="btn btn-primary" onClick={downloadFileDecompressed}>
                                Download Decompressed File
                            </button>
                        )}
                        {mode === 'compress' && (
                            <button className="btn btn-warning" onClick={downloadFileCompressed}>
                                Download Compressed File
                            </button>
                        )}
                    </div>
                )}
                <button className="btn btn-danger mt-4" onClick={() => signout()}>Logout</button>
            </div>
        </div>
    );
};

export default FileCompressor;
