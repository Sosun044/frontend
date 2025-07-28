import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    Button,
    Input,
    Select,
    Option,
    Typography,
} from "@material-tailwind/react";
import { updateInventory } from "../services/EnvanterService";

const validationSchema = Yup.object().shape({
    typeId: Yup.number().required("Envanter tipi zorunludur"),
    brand: Yup.string().required("Marka zorunludur"),
    model: Yup.string().required("Model zorunludur"),
    serialNumber: Yup.string().required("Seri numarası zorunludur"),
    status: Yup.string().required("Durum zorunludur"),
    entryDate: Yup.date().required("Giriş tarihi zorunludur"),
});

function InventoryUpdateForm({ open, onClose, inventory, onSave, inventoryTypes }) {
    const formik = useFormik({
        initialValues: {
            typeId: inventory?.typeId || "",
            brand: inventory?.brand || "",
            model: inventory?.model || "",
            serialNumber: inventory?.serialNumber || "",
            status: inventory?.status || "",
            entryDate: inventory?.entryDate || "",
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                await updateInventory(inventory.id, values);
                onSave?.();
                onClose?.();
            } catch (error) {
                console.error("Güncelleme hatası:", error);
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Envanter Tipi */}
            <div>
                <Select
                    label="Envanter Tipi"
                    value={formik.values.typeId?.toString()}
                    onChange={(val) => formik.setFieldValue("typeId", val)}
                >
                    {inventoryTypes.map((type) => (
                        <Option key={type.id} value={type.id.toString()}>
                            {type.name}
                        </Option>
                    ))}
                </Select>
                {formik.touched.typeId && formik.errors.typeId && (
                    <Typography variant="small" color="red">{formik.errors.typeId}</Typography>
                )}
            </div>

            {/* Marka */}
            <div>
                <Input
                    label="Marka"
                    name="brand"
                    value={formik.values.brand}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.brand && formik.errors.brand && (
                    <Typography variant="small" color="red">{formik.errors.brand}</Typography>
                )}
            </div>

            {/* Model */}
            <div>
                <Input
                    label="Model"
                    name="model"
                    value={formik.values.model}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.model && formik.errors.model && (
                    <Typography variant="small" color="red">{formik.errors.model}</Typography>
                )}
            </div>

            {/* Seri No */}
            <div>
                <Input
                    label="Seri Numarası"
                    name="serialNumber"
                    value={formik.values.serialNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.serialNumber && formik.errors.serialNumber && (
                    <Typography variant="small" color="red">{formik.errors.serialNumber}</Typography>
                )}
            </div>

            {/* Durum */}
            <div>
                <Select
                    label="Durum"
                    value={formik.values.status}
                    onChange={(val) => formik.setFieldValue("status", val)}
                >
                    <Option value="IN_PERSONAL">Personelde</Option>
                    <Option value="IN_WAREHOUSE">Depoda</Option>
                    <Option value="IN_OFFICE">Ofiste</Option>
                </Select>
                {formik.touched.status && formik.errors.status && (
                    <Typography variant="small" color="red">{formik.errors.status}</Typography>
                )}
            </div>

            {/* Giriş Tarihi */}
            <div>
                <Input
                    label="Giriş Tarihi"
                    type="date"
                    name="entryDate"
                    value={formik.values.entryDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.entryDate && formik.errors.entryDate && (
                    <Typography variant="small" color="red">{formik.errors.entryDate}</Typography>
                )}
            </div>

            {/* Butonlar */}
            <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-4">
                <Button type="button" variant="outlined" color="red" onClick={onClose}>
                    İptal
                </Button>
                <Button type="submit" color="green">
                    Güncelle
                </Button>
            </div>
        </form>
    );
}

export default InventoryUpdateForm;
