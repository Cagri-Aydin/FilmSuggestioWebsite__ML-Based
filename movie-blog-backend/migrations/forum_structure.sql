-- View'ı sil
DROP VIEW IF EXISTS public.v_topic_summary CASCADE;

-- View'ı oluştur
CREATE OR REPLACE VIEW public.v_topic_summary AS
WITH message_counts AS (
    SELECT topic_id, COUNT(*)::integer as count
    FROM public.messages
    GROUP BY topic_id
)
SELECT 
    t.id,
    t.title,
    t.slug,
    t.content,
    t.created_at,
    t.last_activity,
    t.view_count,
    u.id as author_id,
    u.username as author_username,
    u.avatar as author_avatar,
    c.id as category_id,
    c.name as category_name,
    COALESCE(mc.count, 0) as message_count
FROM public.topics t
LEFT JOIN public.users u ON t.author_id = u.id
LEFT JOIN public.categories c ON t.category_id = c.id
LEFT JOIN message_counts mc ON t.id = mc.topic_id;

-- Slug fonksiyonu
CREATE OR REPLACE FUNCTION public.fn_get_topic_slug(title TEXT) 
RETURNS TEXT AS $$
BEGIN
    RETURN LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- Topic oluşturma fonksiyonu
CREATE OR REPLACE FUNCTION public.sp_create_topic(
    p_title TEXT,
    p_content TEXT,
    p_author_id INTEGER,
    p_category_id INTEGER,
    p_tags JSON
) RETURNS SETOF public.v_topic_summary AS $$
DECLARE
    v_slug TEXT;
    v_topic_id INTEGER;
BEGIN
    v_slug := public.fn_get_topic_slug(p_title);
    
    INSERT INTO public.topics (title, slug, content, author_id, category_id, created_at, last_activity)
    VALUES (p_title, v_slug, p_content, p_author_id, p_category_id, NOW(), NOW())
    RETURNING id INTO v_topic_id;
    
    IF p_tags IS NOT NULL THEN
        INSERT INTO public.topic_tags (topic_id, tag_name)
        SELECT v_topic_id, json_array_elements_text(p_tags);
    END IF;
    
    RETURN QUERY
    SELECT * FROM public.v_topic_summary WHERE id = v_topic_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger fonksiyonu
CREATE OR REPLACE FUNCTION public.fn_update_topic_activity()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.topics 
    SET last_activity = NOW(),
        message_count = COALESCE(message_count, 0) + 1
    WHERE id = NEW.topic_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DROP TRIGGER IF EXISTS tr_update_topic_activity ON public.messages;
CREATE TRIGGER tr_update_topic_activity
    AFTER INSERT ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_update_topic_activity(); 