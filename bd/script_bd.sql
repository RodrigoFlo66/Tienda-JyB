
CREATE SEQUENCE public.clientes_id_cliente_seq_1;

CREATE TABLE public.CLIENTES (
                id_cliente INTEGER NOT NULL DEFAULT nextval('public.clientes_id_cliente_seq_1'),
                nombre_cliente VARCHAR NOT NULL,
                num_cliente VARCHAR NOT NULL,
                CONSTRAINT id_cliente PRIMARY KEY (id_cliente)
);


ALTER SEQUENCE public.clientes_id_cliente_seq_1 OWNED BY public.CLIENTES.id_cliente;

CREATE SEQUENCE public.proveedores_id_proveedor_seq;

CREATE TABLE public.PROVEEDORES (
                id_proveedor INTEGER NOT NULL DEFAULT nextval('public.proveedores_id_proveedor_seq'),
                nombre_proveedor VARCHAR NOT NULL,
                num_proveedor VARCHAR NOT NULL,
                descripcion_proveedor VARCHAR NOT NULL,
                CONSTRAINT id_proveedor PRIMARY KEY (id_proveedor)
);


ALTER SEQUENCE public.proveedores_id_proveedor_seq OWNED BY public.PROVEEDORES.id_proveedor;

CREATE SEQUENCE public.productos_id_categoria_seq_1;

CREATE TABLE public.CATEGORIAS (
                id_categoria INTEGER NOT NULL DEFAULT nextval('public.productos_id_categoria_seq_1'),
                nombre_categoria VARCHAR NOT NULL,
                CONSTRAINT id_categoria PRIMARY KEY (id_categoria)
);


ALTER SEQUENCE public.productos_id_categoria_seq_1 OWNED BY public.CATEGORIAS.id_categoria;

CREATE SEQUENCE public.productos_id_producto_seq;

CREATE TABLE public.PRODUCTOS (
                id_producto INTEGER NOT NULL DEFAULT nextval('public.productos_id_producto_seq'),
                imagen VARCHAR NOT NULL,
                id_categoria INTEGER NOT NULL,
                nombre_producto VARCHAR NOT NULL,
                precio_unitario REAL NOT NULL,
                descripcion VARCHAR NOT NULL,
                total INTEGER NOT NULL,
                CONSTRAINT id_producto PRIMARY KEY (id_producto)
);


ALTER SEQUENCE public.productos_id_producto_seq OWNED BY public.PRODUCTOS.id_producto;

CREATE SEQUENCE public.ventas_id_venta_seq;

CREATE TABLE public.VENTAS (
                id_venta INTEGER NOT NULL DEFAULT nextval('public.ventas_id_venta_seq'),
                id_producto INTEGER NOT NULL,
                id_cliente INTEGER NOT NULL,
                cantidad_venta INTEGER NOT NULL,
                tipo_venta INTEGER NOT NULL,
                precio_total REAL NOT NULL,
                fecha_venta DATE NOT NULL,
                CONSTRAINT id_venta PRIMARY KEY (id_venta)
);


ALTER SEQUENCE public.ventas_id_venta_seq OWNED BY public.VENTAS.id_venta;

CREATE SEQUENCE public.lotes_id_lote_seq;

CREATE TABLE public.LOTES (
                id_lote INTEGER NOT NULL DEFAULT nextval('public.lotes_id_lote_seq'),
                id_proveedor INTEGER NOT NULL,
                id_producto INTEGER NOT NULL,
                cantidad INTEGER NOT NULL,
                costo_total REAL NOT NULL,
                fecha_compra DATE NOT NULL,
                costo_unitario REAL NOT NULL,
                fecha_caducidad DATE NOT NULL,
                CONSTRAINT id_lote PRIMARY KEY (id_lote)
);


ALTER SEQUENCE public.lotes_id_lote_seq OWNED BY public.LOTES.id_lote;

ALTER TABLE public.VENTAS ADD CONSTRAINT clientes_ventas_fk
FOREIGN KEY (id_cliente)
REFERENCES public.CLIENTES (id_cliente)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.LOTES ADD CONSTRAINT proveedores_lotes_fk
FOREIGN KEY (id_proveedor)
REFERENCES public.PROVEEDORES (id_proveedor)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.PRODUCTOS ADD CONSTRAINT categorias_productos_fk
FOREIGN KEY (id_categoria)
REFERENCES public.CATEGORIAS (id_categoria)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.LOTES ADD CONSTRAINT productos_lotes_fk
FOREIGN KEY (id_producto)
REFERENCES public.PRODUCTOS (id_producto)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.VENTAS ADD CONSTRAINT productos_ventas_fk
FOREIGN KEY (id_producto)
REFERENCES public.PRODUCTOS (id_producto)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;