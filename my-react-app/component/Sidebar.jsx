import { IoArrowDownOutline } from "react-icons/io5";
import "./Sidebar.css";

import React, { useState, useEffect } from "react";

function List({ content, onItemChange }) {
    const [active, setActive] = useState(true);
    const [checkedItems, setCheckedItems] = useState(() =>
        content.list.map((item) => item.check || false)
    );

    const handleCheckboxChange = (item, index) => {
        const updatedCheckedItems = Array(content.list.length).fill(false);
        if (!checkedItems[index]) {
            updatedCheckedItems[index] = true;
            setCheckedItems(updatedCheckedItems);
            onItemChange(item.name.toLowerCase());
        } else {
            setCheckedItems(updatedCheckedItems); // uncheck all
        }
    };

    const handleClick = () => {
        setActive((prevActive) => !prevActive);
    };

    return (
        <div className="sidebar-container">
            {content.listname === null ? null : (
                <div className="list-header">
                    <IoArrowDownOutline onClick={handleClick} />
                    {content.listname}
                </div>
            )}
            {content.list.map((item, index) => (
                <div key={index}>
                    {active && (
                        <div className="list-content">
                            <div>
                                <input
                                    type="checkbox"
                                    checked={checkedItems[index]}
                                    onChange={() =>
                                        handleCheckboxChange(item, index)
                                    }
                                />
                                {item.name}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
function Sidebar({ onItemChange, type, permissionsId }) {
    const SidebarData =
        type === "/admin"
            ? permissionsId.includes(1)
                ? [
                      {
                          listname: null,
                          list: [
                              { name: "User", check: true },
                              { name: "Role", check: false },
                              { name: "Lịch sử", check: false },
                              {
                                  name: "Phê duyệt cập nhật dữ liệu",
                                  check: false,
                              },
                          ],
                      },
                  ]
                : [
                      {
                          listname: null,
                          list: [{ name: "Lịch sử", check: false }],
                      },
                  ]
            : [
                  {
                      listname: "Bản đồ nền",
                      list: [{ name: "Ranh giới xã", check: false }],
                  },
                  {
                      listname: "Bản đồ chuyên đề",
                      list: [
                          { name: "Cảnh báo cháy rừng", check: true },
                          { name: "Hiện trạng lô rừng", check: false },
                          { name: "Biến động diện tích rừng", check: false },
                      ],
                  },
              ]; // Trả về mảng rỗng nếu không phải trang admin

    console.log(SidebarData); // Ghi log nội dung của sidebar
    return (
        <div className="sidebar">
            {SidebarData.map((content, index) => (
                <div key={index}>
                    <List content={content} onItemChange={onItemChange} />
                </div>
            ))}
        </div>
    );
}

export default Sidebar;
