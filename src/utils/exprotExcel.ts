import ExcelJS from 'exceljs'

export const autoWidthAction = (val, width = 10) => {
    if (val == null) {
        width = 10;
    } else if (val.toString().charCodeAt(0) > 255) {
        /*if chinese*/
        width = val.toString().length * 2;
    } else {
        width = val.toString().length;
    }
    return width; // 确保返回计算出的宽度值
}

// 导出普通Excel
export const exportExcel = async ({ column, data, filename, autoWidth, format }) => {
    console.log('data----------:', data);
    // 状态映射
    const useStatusMap = {
        0: '已启用',
        1: '未启用',
        2: '已作废'
    }

    // 确认状态映射
    const categoryStatusMap = {
        0: '推荐分类',
        1: '已确认',
        2: '未找到分类',
        3: '未找到使用',
    }

    // 状态映射
    const compareStatusMap = {
        0: '未确认',
        1: '已确认',
    }

    // 比对状态
    const changeMap = {
        0: '正常',
        1: '新增',
        2: '自身有变更',
        3: '同类有变更',
        4: '未找到使用'
    }

    // 预处理数据，将需要映射的字段值替换为对应的映射值
    const processedData = data.map(item => {
        const newItem = { ...item };
        if (newItem.useStatus !== undefined && useStatusMap[newItem.useStatus] !== undefined) {
            newItem.useStatus = useStatusMap[newItem.useStatus];
        }
        if (newItem.categoryStatus !== undefined && categoryStatusMap[newItem.categoryStatus] !== undefined) {
            newItem.categoryStatus = categoryStatusMap[newItem.categoryStatus];
        }
        if (newItem.compareStatus !== undefined && compareStatusMap[newItem.compareStatus] !== undefined) {
            newItem.compareStatus = compareStatusMap[newItem.compareStatus];
        }
        if (newItem.change !== undefined && changeMap[newItem.change] !== undefined) {
            newItem.change = changeMap[newItem.change];
        }
        return newItem;
    });

    // 创建excel工作簿
    const workbook = new ExcelJS.Workbook();
    // 设置工作簿属性
    workbook.creator = 'Me';
    workbook.title = filename;
    workbook.created = new Date();
    workbook.modified = new Date();
    // 添加工作表
    const worksheet = workbook.addWorksheet(filename);
    // 设置列名
    const columnsName = [];
    console.log('column----------:', column);
    for (let item in column) {
        console.log('item----------:', item);
    }
    column.forEach((item, index) => {
        const obj = {
            header: item.label,
            key: item.name,
            width: null
        };
        if (autoWidth) {
            const maxArr = [autoWidthAction(item.label)];
            processedData.forEach(ite => {
                const str = ite[item.name] || '';
                if (str) {
                    maxArr.push(autoWidthAction(str));
                }
            });
            obj.width = Math.max(...maxArr) + 5; // 确保宽度值被正确设置
        }
        // 设置列名、键和宽度
        columnsName.push(obj);
    });
    worksheet.columns = columnsName;
    // 添加行
    worksheet.addRows(processedData);
    // 写入文件
    const uint8Array =
        format === "xlsx"
            ? await workbook.xlsx.writeBuffer()
            : await workbook.csv.writeBuffer();
    const blob = new Blob([uint8Array], { type: 'application/octet-binary' });
    // 判断是否允许用户在客户端上保存文件
    if (window.navigator.msSaveOrOpenBlob) {
        // msSaveOrOpenBlob方法返回boolean值
        navigator.msSaveBlob(blob, filename + `.${format}`);
        // 本地保存
    } else {
        const link = document.createElement("a"); // a标签下载
        link.href = window.URL.createObjectURL(blob); // href属性指定下载链接
        link.download = filename + `.${format}`; // dowload属性指定文件名
        link.click(); // click()事件触发下载
        window.URL.revokeObjectURL(link.href); // 释放内存
    }
}
