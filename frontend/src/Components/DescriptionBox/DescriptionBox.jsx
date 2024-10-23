import React from "react";
import "./DescriptionBox.css";
const DescriptionBox = () => {
  return (
    <div className="descriptionbox">
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (122)</div>
      </div>
      <div className="descriptionbox-description">
        <p>
          An e-commerce website is an online platform that facilitates for
          buying or selling of products or services over the internet and serves
          a virtual marketplace where businesses and individuals can showcase
          yheir products, interect with customers, and conduct the trasections
          without the need for a physical presence. E-commerce websites have
          gained immense popularity due to their convenince accessibility, and
          the global reach they offer.
        </p>
        <p>
          E-commerce website typically display products or services along with
          detailed descriptions, images, prices, and any available variations (
          e.g. sizes, colors). Each products usually has its own dedicated page
          with its relevant information.
        </p>
      </div>
    </div>
  );
};

export default DescriptionBox;
