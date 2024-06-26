import React, { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import { Redirect, useParams } from "react-router";
import { Link } from "react-router-dom";
import { useInvoiceContext } from "../context/invoice_context";
import { formatDate, formatPrice, useDelayUnmount } from "../helpers";
import NewInvoiceModal from "./NewInvoiceModal";

const InvoiceDetails = () => {
  let id = useParams();
  const {
    invoices,
    getSingleInvoice,
    single_invoice,
    deleteInvoice,
    changeStatus,
    toggleNewInvoiceModal,
    isNewInvoiceOpen,
  } = useInvoiceContext();
  const [isRedirect, setIsRedirect] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const shouldRenderChild = useDelayUnmount(isDeleteModalOpen, 300);
  const shouldRenderChild2 = useDelayUnmount(isNewInvoiceOpen, 300);
  const mountedStyle = { animation: "inAnimation 300ms ease-in" };
  const unmountedStyle = { animation: "outAnimation 310ms ease-in" };

  // Close the modal when press 'Esc' OR outside the modal ==============================
  const modalRef = useRef();
  const closeModal = (e: any) => {
    if (modalRef.current === e.target) {
      handleClick();
    }
  };
  const keyEsc = useCallback(
    (e: any) => {
      if (e.key === "Escape" && isDeleteModalOpen) {
        handleClick();
      }
    },
    // eslint-disable-next-line
    [isDeleteModalOpen]
  );
  useEffect(() => {
    document.addEventListener("keydown", keyEsc);
    return () => document.removeEventListener("keydown", keyEsc);
  }, [keyEsc]);




  useEffect(() => {
    setIsRedirect(false);
  }, [single_invoice]);

  const handleClick = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };
  const handleDelete = (_id: string) => {
    deleteInvoice(_id);
    setIsRedirect(true); //THIS REDIRECT TO HOMEPAGE
  };

  useEffect(() => {
    getSingleInvoice(id);
    // eslint-disable-next-line
  }, [invoices]);

  //TO CHANGE WITH A LOADING STATUS LATER WHEN WE GONNA FETCH DATA FROM DATABASE
  if (single_invoice) {
    if (Object.keys(single_invoice).length === 0) {
      return <h2>Loading</h2>;
    }
  } else {
    return <h2>Loading</h2>;
  }

  const {
    _id,
    id: idInvoice,
    clientName,
    status,
    description,
    senderAddress: {
      city: citySender,
      street: streetSender,
      country: countrySender,
      postCode: postCodeSender,
    },
    clientAddress: {
      city: cityClient,
      street: streetClient,
      country: countryClient,
      postCode: postCodeClient,
    },
    items,
    total,
    clientEmail,
    createdAt,
    paymentDue,
  } = single_invoice;


  return (
    <section className="invoiceDetails-section">
      <Link to="/">
        <div className="go-back-container">
          <img src="/assets/icon-arrow-left.svg" alt=""></img>
          <h4>Go Back</h4>
        </div>
      </Link>
      <div className="status-container">
        <p>Status</p>
        <div className={`status-cell ${status}`}>
          <div className="status">
            <div className="status-circle"></div>
            <h2>{status}</h2>
          </div>
        </div>
      </div>
      <div className="invoiceDetails-btns">
        <button className="btn secondary-btn" onClick={toggleNewInvoiceModal}>
          Edit
        </button>
        <button className="btn delete" onClick={handleClick}>
          Delete
        </button>
        {status === "pending" ? (
          <button
            className="btn confirm"
            onClick={() => changeStatus(single_invoice, "pending", _id)}
          >
            Mark as paid
          </button>
        ) : (
          <button
            className="btn confirm"
            onClick={() => changeStatus(single_invoice, "paid", _id)}
          >
            Mark as pending
          </button>
        )}
      </div>
      <div className="invoiceDetails-main">
        <div className="invoiceDetails-text">
          <div className="id-job">
            <h3>#{idInvoice}</h3>
            <p className="p-gray">{description}</p>
          </div>
          <div className="sender-address-container">
            <p className="p-gray">{streetSender}</p>
            <p className="p-gray">{citySender}</p>
            <p className="p-gray">{postCodeSender}</p>
            <p className="p-gray">{countrySender}</p>
          </div>
          <div className="dates-container">
            <div className="invoice-date">
              <p className="p-gray">Invoice Date:</p>
              <h2>{formatDate(createdAt)}</h2>
            </div>
            <div className="invoice-date">
              <p className="p-gray">Invoice Due:</p>
              <h2>{formatDate(paymentDue)}</h2>
            </div>
          </div>
          <div className="client-address-container">
            <p className="p-gray">Bill to</p>
            <h2>{clientName}</h2>
            <p className="p-gray">{streetClient}</p>
            <p className="p-gray">{cityClient}</p>
            <p className="p-gray">{postCodeClient}</p>
            <p className="p-gray">{countryClient}</p>
          </div>
          <div className="email-container">
            <p className="p-gray">Sent to</p>
            <h2>{clientEmail}</h2>
          </div>
        </div>
        <div className="invoiceDetails-items-container">
          <div className="invoiceDetails-item titles">
            <div className="item-name">
              <p className="p-gray">Item</p>
            </div>
            <div className="item-quantity">
              <p className="p-gray">QTY.</p>
            </div>
            <div className="item-price">
              <p className="p-gray">Price</p>
            </div>
            <div className="item-total">
              <p className="p-gray">Total</p>
            </div>
          </div>
          {items.map(
            (
              item: {
                name: string;
                quantity: number;
                price: number;
                total: number;
              },
              i: any
            ) => {
              const { name, quantity, price, total } = item;

              return (
                <div className="invoiceDetails-item" key={i}>
                  <div className="item-name">
                    <h4>{name}</h4>
                  </div>
                  <div className="item-quantity">
                    <h4>{quantity}</h4>
                  </div>
                  <div className="item-price">
                    <h4>{formatPrice(price)}</h4>
                  </div>
                  <div className="item-total">
                    <h4>{formatPrice(total)}</h4>
                  </div>
                </div>
              );
            }
          )}

          <div className="invoiceDetails-grandTotal">
            <p>Grand Total</p>
            <h2>{formatPrice(total)}</h2>
          </div>
        </div>
      </div>
      {/* DELETE MODAL ===================================================*/}
      {shouldRenderChild && (
        <div
        onClick={closeModal}
          ref={modalRef}
          className="delete-modal-cover"
          style={isDeleteModalOpen ? mountedStyle : unmountedStyle}
        >
          <div className="delete-modal">
            <h2>Confirm Deletion</h2>
            <p>
              Are you sure you want to delete invoice {`#${idInvoice}`}? <br></br> This
              action cannot be undone.
            </p>
            <div className="delete-btn-container">
              <button className="edit btn " onClick={handleClick}>
                Cancel
              </button>
              <button className="btn delete" onClick={() => handleDelete(_id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* REDIRECT TO HOMEPAGE IF THE INVOICE IS DELETED CORRECTLY */}
      {isRedirect && <Redirect push to="/" />}
      {shouldRenderChild2 && (
        <div style={isNewInvoiceOpen ? mountedStyle : unmountedStyle}>
          <NewInvoiceModal isEdit={true} />
        </div>
      )}
    </section>
  );
};

export default InvoiceDetails;
