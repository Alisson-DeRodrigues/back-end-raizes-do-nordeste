--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0
-- Dumped by pg_dump version 17.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- Name: users; Type: TABLE; Schema: public; Owner: u0_a406
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role text NOT NULL
);


ALTER TABLE public.users OWNER TO u0_a406;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: u0_a406
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO u0_a406;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: u0_a406
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: u0_a406
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: u0_a406
--

COPY public.users (id, email, password, role) FROM stdin;
1	admin@email.com	$2y$10$z1Atic9DQCMM4E3SMdw7C.VYi7hfdzxyXZnULi3YhBngvDDG5Sj9a	admin
2	user@email.com	$2y$10$z1Atic9DQCMM4E3SMdw7C.VYi7hfdzxyXZnULi3YhBngvDDG5Sj9a	user
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: u0_a406
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: u0_a406
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: u0_a406
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: u0_a406
--

GRANT ALL ON TABLE public.users TO alisson;


--
-- PostgreSQL database dump complete
--

