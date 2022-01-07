import React, { useState, useEffect } from "react";
import { Modal, ModalBody, Carousel } from "react-bootstrap";
import classNames from "classnames";
import { API } from 'aws-amplify';

function PhotoAlbum({ photoAlbumClosed, proposalId, imagesArr }) {
    const [showAlbumModal, setShowAlbumModal]: any = useState(true);
    const [isArabic, setIsArabic] = useState(false);
    const [photosAlbum, setPhotoAlbum]: any = useState(imagesArr);

    //close modal, call parent functionality on close
    const handleCloseModal = () => {
        setShowAlbumModal(false);
        photoAlbumClosed();
    }

    //get all updates added to proposals
    const getUpdates = async () => {
        await API.get("auth", "/api/borrow/proposalImages", {
            headers: { "Content-Type": "application/json" },
            queryStringParameters: { proposalId: proposalId },
        }).then((response) => {
            if (response.success) {
                let images: string[] = []
                for (var i = 0; i < response.data.length; ++i) {
                    images.push(response.data[i].image)
                }
                setPhotoAlbum([...photosAlbum, ...images])
            }
        });
    };

    useEffect(() => {
        getUpdates()
    }, [])

    return (
        <Modal
            show={showAlbumModal}
            onHide={() => {
                handleCloseModal()
            }}
            size="lg"
            backdrop="static"
            className={classNames("dln-centered-vertically-modal", isArabic && "app-arabic-lang")}
            scrollable={true}

        >
            <Modal.Header closeButton></Modal.Header>
            <ModalBody>

                <Carousel fade >
                    {photosAlbum ?
                        photosAlbum.map((item, index) => (
                            <Carousel.Item key={index} >
                                <div style={{ backgroundImage: `url(${item})` }} className="app-proposal-image-carousel">

                                </div>
                            </Carousel.Item>
                        )) : null
                    }
                </Carousel>
            </ModalBody>
        </Modal>
    );
};

export default PhotoAlbum;