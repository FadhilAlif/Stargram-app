--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Comments" (
    id integer NOT NULL,
    "UserId" integer,
    "PhotoId" integer,
    comment text NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Comments" OWNER TO postgres;

--
-- Name: Comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Comments_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Comments_id_seq" OWNER TO postgres;

--
-- Name: Comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Comments_id_seq" OWNED BY public."Comments".id;


--
-- Name: Photos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Photos" (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    caption text NOT NULL,
    poster_image_url text NOT NULL,
    "UserId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Photos" OWNER TO postgres;

--
-- Name: Photos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Photos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Photos_id_seq" OWNER TO postgres;

--
-- Name: Photos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Photos_id_seq" OWNED BY public."Photos".id;


--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- Name: SocialMedias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SocialMedias" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    social_media_url character varying(255) NOT NULL,
    "UserId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."SocialMedias" OWNER TO postgres;

--
-- Name: SocialMedias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SocialMedias_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SocialMedias_id_seq" OWNER TO postgres;

--
-- Name: SocialMedias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SocialMedias_id_seq" OWNED BY public."SocialMedias".id;


--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    profile_image_url text NOT NULL,
    age integer NOT NULL,
    phone_number bigint NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Users_id_seq" OWNER TO postgres;

--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: Comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comments" ALTER COLUMN id SET DEFAULT nextval('public."Comments_id_seq"'::regclass);


--
-- Name: Photos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Photos" ALTER COLUMN id SET DEFAULT nextval('public."Photos_id_seq"'::regclass);


--
-- Name: SocialMedias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SocialMedias" ALTER COLUMN id SET DEFAULT nextval('public."SocialMedias_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Data for Name: Comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Comments" (id, "UserId", "PhotoId", comment, "createdAt", "updatedAt") FROM stdin;
1	1	1	nyenyenyeneye	2025-03-16 12:18:49.798+07	2025-03-16 12:18:49.798+07
3	3	1	Test comment nihasdlasjdajsodasd	2025-03-16 13:48:13.925+07	2025-03-16 13:48:13.925+07
6	3	4	apasih?	2025-03-16 14:09:25.509+07	2025-03-16 15:03:44.668+07
12	3	4	Coba komen lagi ah	2025-03-16 15:06:24.22+07	2025-03-16 15:06:24.22+07
7	3	4	coba edit bisa ga ya	2025-03-16 14:30:27.72+07	2025-03-16 15:06:36.716+07
18	3	11	benerin backend	2025-03-18 09:53:35.529+07	2025-03-18 09:53:46.321+07
20	3	12	Marten Paess terbaikk no 1 brooo	2025-03-19 23:36:28.364+07	2025-03-19 23:36:59.582+07
\.


--
-- Data for Name: Photos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Photos" (id, title, caption, poster_image_url, "UserId", "createdAt", "updatedAt") FROM stdin;
1	first title	my caption	https://your_poster.png	1	2025-03-16 12:18:49.788+07	2025-03-16 12:18:49.788+07
8	Sandyy si tupai	ini sandy temennya spongebob	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM938kYifUxqw1PGb_-cdOlUZHrtKds3dOkeXmw_6TkYve5McNZyRo4R5jIXSv3GfzZg3Rj3PNvph4Zo6T0-qdGnde621ev7vCcACGQQ	3	2025-03-16 15:13:50.933+07	2025-03-16 15:14:36.474+07
11	Google OAuth	asgdagsdgasdgagdjhagdgajsgdjasggdajhgdasdas	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSTLNyHEp8ERADDJDy5wXQLoV_Lj0YTmv6eA&s	3	2025-03-18 09:53:06.304+07	2025-03-18 09:53:06.304+07
12	Marten Paes atau Emil Audero	Kiper Terbaik Timnas Marten Paes atau Emil Audero?	https://static.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/p2/125/2024/12/18/maarten-paes-vs-emil-audero-196618884.jpg	3	2025-03-19 23:35:59.045+07	2025-03-19 23:35:59.045+07
4	Mobil Garang Nih	Tebak mobil apa?	https://www.shutterstock.com/image-vector/car-logo-icon-emblem-design-600nw-473088025.jpg	3	2025-03-16 14:02:10.857+07	2025-03-20 08:44:19.075+07
13	Indonesia vs Australia	Menurut Kalian Siapa Yang Menang? 	https://akcdn.detik.net.id/community/media/visual/2024/10/12/jay-idzes_43.jpeg?w=1200	3	2025-03-20 08:47:18.963+07	2025-03-20 08:47:18.963+07
\.


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SequelizeMeta" (name) FROM stdin;
20221002140837-create-user.js
20221002141025-create-photo.js
20221002141159-create-social-media.js
20221002141354-create-comment.js
20221002142058-add_fk_photos.js
20221002142415-add_fk_socialmedias.js
20221002142546-add_fk_comment.js
20221003025021-add_unique_to_users.js
\.


--
-- Data for Name: SocialMedias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SocialMedias" (id, name, social_media_url, "UserId", "createdAt", "updatedAt") FROM stdin;
1	instagram	https://www.instagram.com	1	2025-03-16 12:18:49.794+07	2025-03-16 12:18:49.794+07
2	Instagram	https://www.instagram.com	3	2025-03-16 14:26:03.289+07	2025-03-16 14:26:53.418+07
5	Telegram	https://web.telegram.org/	3	2025-03-19 22:43:48.742+07	2025-03-19 22:43:48.742+07
8	Instagram	www.instagram.com	3	2025-03-20 08:45:07.749+07	2025-03-20 08:45:07.749+07
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, full_name, email, username, password, profile_image_url, age, phone_number, "createdAt", "updatedAt") FROM stdin;
1	Tono Sekrup	justtono@gmail.com	tons	$2b$10$zHsC9pb6TZyhUG3aUPDUI.sq19jnRUkyFKAirLxA47nWtze8iRVI2	http://tono-pict.png	22	231	2025-03-16 12:18:49.774+07	2025-03-16 12:18:49.774+07
3	Admin Nih	admin@gmail.com	admin	$2a$10$8ckwFdGtVDG8xUMzF8wbNuOY2z6dds.eTFBQmywDZk3VJ66imnfDy	https://img.a.transfermarkt.technology/portrait/big/546926-1725530125.jpg?lm=1	50	85727304551	2025-03-16 13:04:11.361+07	2025-03-20 08:44:48.068+07
\.


--
-- Name: Comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Comments_id_seq"', 21, true);


--
-- Name: Photos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Photos_id_seq"', 13, true);


--
-- Name: SocialMedias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."SocialMedias_id_seq"', 8, true);


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Users_id_seq"', 4, true);


--
-- Name: Comments Comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comments"
    ADD CONSTRAINT "Comments_pkey" PRIMARY KEY (id);


--
-- Name: Photos Photos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Photos"
    ADD CONSTRAINT "Photos_pkey" PRIMARY KEY (id);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: SocialMedias SocialMedias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SocialMedias"
    ADD CONSTRAINT "SocialMedias_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: Users unique_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT unique_email UNIQUE (email);


--
-- Name: Users unique_username; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT unique_username UNIQUE (username);


--
-- Name: Comments photo_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comments"
    ADD CONSTRAINT photo_fk FOREIGN KEY ("PhotoId") REFERENCES public."Photos"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comments user_fk_comments; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comments"
    ADD CONSTRAINT user_fk_comments FOREIGN KEY ("UserId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Photos user_fk_photos; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Photos"
    ADD CONSTRAINT user_fk_photos FOREIGN KEY ("UserId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SocialMedias user_fk_socialmedias; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SocialMedias"
    ADD CONSTRAINT user_fk_socialmedias FOREIGN KEY ("UserId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

